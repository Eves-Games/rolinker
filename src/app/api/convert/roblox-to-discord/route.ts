import { getDetailedAccounts } from "@/lib/accounts";
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
    const apiKeyHeader = headersList.get('Authorization');
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('robloxId');

    if (!query) return new NextResponse('No Roblox ID key provided', {
        status: 400,
    });

    if (!apiKeyHeader) return new NextResponse('No API key provided', {
        status: 400,
    });

    const guildApiKey = await db.guild.findUnique({
        where: { apiKey: apiKeyHeader }
    });

    if (!guildApiKey) return new NextResponse('Invalid API key', {
        status: 401,
    });

    if (guildApiKey.apiKeyUsage == 750) return new NextResponse('API key usage limit reached (750)', {
        status: 401,
    });

    db.guild.update({
        where: { apiKey: apiKeyHeader },
        data: { apiKeyUsage: { increment: 1 } }
    }).catch();

    const account = await db.account.findUnique({
        where: { id: query }
    });

    if (!account) {
        return new NextResponse('User not found', { status: 400, });
    };

    return NextResponse.json({ userId: account.userId });
};