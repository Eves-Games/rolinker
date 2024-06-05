import { apiKeyCheck } from "@/api";
import db from "@/db";
import { rest } from "@/discord/rest";
import { findAssociatedAccount } from "@/discord/util";
import { getGroupRoles, getUserRoles } from "@/roblox";
import { APIGuildMember, RESTGetAPIGuildResult, Routes } from "discord-api-types/v10";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const searchParams = request.nextUrl.searchParams;

    const apiKeyResult = await apiKeyCheck(request);
    if (apiKeyResult instanceof NextResponse) return apiKeyResult;
    const { apiKey } = apiKeyResult;

    const memberId = searchParams.get('memberId')
    if (!memberId) return new NextResponse('No member ID provided', { status: 400 });

    const guildId = params.id;
    const botGuild = await rest.get(Routes.guild(guildId)).catch(() => { return null; }) as RESTGetAPIGuildResult | null;
    if (!botGuild) return new NextResponse('Could not find guild', { status: 404 });
    if (botGuild.owner_id !== apiKey.userId) return new NextResponse('Unauthorized API key', { status: 401 });

    const guild = await db.guild.findUnique({ where: { id: guildId } });
    if (!guild || !guild.groupId) return new NextResponse('Guild is not linked to a Roblox group', { status: 404 });

    const member = await rest.get(Routes.guildMember(guildId, memberId)).catch(() => { return null; }) as APIGuildMember | null;
    if (!member) return new NextResponse('User not apart of guild API key is linked too', { status: 404 });

    const account = await findAssociatedAccount(memberId, guildId);
    if (!account) return new NextResponse('User has no linked Roblox accounts', { status: 400 });

    const groupRoles = await getGroupRoles(guild.groupId);
    const userRoles = await getUserRoles(account.id);
    const userRole = userRoles.data.find(role => role.group.id === parseInt(guild.groupId!));
    const memberRoles = member.roles;

    if (!groupRoles || !userRole) return new NextResponse('User is not in linked Roblox group', { status: 400 });

    const removeRanks = groupRoles.roles.filter(role => role.id == userRole.role.id);
    const removeRoles = botGuild.roles.filter(role => removeRanks.some(rank => rank.name === role.name)).filter(role => memberRoles.includes(role.name));
    const addRole = botGuild.roles.find(role => role.name == userRole.role.name);

    await rest.put(Routes.guildMemberRole(guildId, member.user!.id, addRole!.id)).catch();

    for (const role of removeRoles) await rest.delete(Routes.guildMemberRole(guildId, member.user!.id, role.id)).catch();

    return new NextResponse('Success');
};