import db from "@/lib/db";
import { rest } from "@/lib/discord/rest";
import { findAssociatedAccount } from "@/lib/discord/util";
import { getGroups, getRoles, getUserRoleInGroup } from "@/lib/roblox";
import { APIGuildMember, RESTGetAPIGuildRolesResult, Routes } from "discord-api-types/v10";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const headersList = headers();
    const apiKeyHeader = headersList.get('api-key');
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('userId');

    if (!query) return new NextResponse('No User ID key provided', {
        status: 400,
    });

    if (!apiKeyHeader) return new NextResponse('No API key provided', {
        status: 400,
    });

    const guildApiKey = await db.guild.findUnique({
        where: {
            apiKey: apiKeyHeader
        }
    });

    if (!guildApiKey) return new NextResponse('Invalid API key', {
        status: 401,
    });

    if (guildApiKey.apiKeyUsage == 750) return new NextResponse('API key usage limit reached (750)', {
        status: 401,
    });

    db.guild.update({
        where: {
            apiKey: apiKeyHeader
        },
        data: {
            apiKeyUsage: { increment: 1 }
        }
    }).catch();

    const { id, groupId } = guildApiKey

    if (!groupId) return new NextResponse('Guild is not linked to a Roblox group', {
        status: 400,
    });

    const memberData = await rest.get(Routes.guildMember(guildApiKey.id, query));

    if (!isAPIGuildMember(memberData)) {
        return new NextResponse('User not apart of guild API key is linked too', { status: 404, });
    }

    const member: APIGuildMember = memberData;

    function isAPIGuildMember(obj: any): obj is APIGuildMember {
        return obj && typeof obj === 'object' && 'user' in obj && 'roles' in obj;
    }

    const account = await findAssociatedAccount(query, id);

    if (!account) return new NextResponse('User has no linked Roblox accounts', {
        status: 400,
    });

    const groupRanks = await getRoles(groupId);
    const userRank = await getUserRoleInGroup(account.id, groupId);
    const memberRoles = member.roles;

    if (!groupRanks || !userRank) {
        return new NextResponse('User is not in linked Roblox group', {
            status: 400,
        });
    };

    const guildRolesData = await rest.get(Routes.guildRoles(id)).catch(() => { return []; }) as RESTGetAPIGuildRolesResult;

    const removeRanks = groupRanks.filter(rank => rank.id == userRank.id);
    const removeRoles = guildRolesData.filter(role => removeRanks.some(rank => rank.name === role.name)).filter(role => memberRoles.includes(role.name));
    const addRole = guildRolesData.find(role => role.name == userRank.name);

    await rest.put(Routes.guildMemberRole(id, member.user!.id, addRole!.id)).catch();

    for (const role of removeRoles) {
        await rest.delete(Routes.guildMemberRole(id, member.user!.id, role.id)).catch();
    };

    return new NextResponse('Success', {
        status: 200,
    });
};