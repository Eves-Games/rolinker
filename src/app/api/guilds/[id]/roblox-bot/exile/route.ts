import { apiKeyCheck } from "@/api";
import db from "@/db";
import { rest } from "@/discord/rest";
import { Client } from "bloxy";
import { RESTGetAPIGuildResult, Routes } from "discord-api-types/v10";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const searchParams = request.nextUrl.searchParams;

    const apiKeyResult = await apiKeyCheck(request);
    if (apiKeyResult instanceof NextResponse) return apiKeyResult;
    const { apiKey } = apiKeyResult;

    const robloxId = searchParams.get('robloxId');
    if (!robloxId) return new NextResponse('No Roblox ID provided', { status: 400 });

    const guildId = params.id;
    const botGuild = await rest.get(Routes.guild(guildId)).catch(() => { return null; }) as RESTGetAPIGuildResult | null;
    if (!botGuild) return new NextResponse('Could not find guild', { status: 404 });
    if (botGuild.owner_id !== apiKey.userId) return new NextResponse('Unauthorized API key', { status: 401 });

    const guild = await db.guild.findUnique({ where: { id: guildId } });
    if (!guild || !guild.groupId) return new NextResponse('Guild is not linked to a Roblox group', { status: 404 });
    if (!guild.robloxCookie) return new NextResponse('Guild is not linked to a Roblox group', { status: 404 });

    let client: Client;

    try {
        client = new Client({ credentials: { cookie: guild.robloxCookie } });
        await client.login();
    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    };

    try {
        const group = await client.getGroup(parseInt(guild.groupId));
        await group.kickMember(parseInt(robloxId));

        return new NextResponse('Success');
    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    };
};