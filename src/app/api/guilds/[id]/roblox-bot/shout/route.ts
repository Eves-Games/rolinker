import db from "@/lib/db";
import { rest } from "@/lib/discord/rest";
import { updateStatus } from "@/lib/roblox";
import { Client } from "bloxy";
import { RESTGetAPIGuildResult, Routes } from "discord-api-types/v10";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const headersList = headers();

    const apiKeyHeader = headersList.get('apiKey');
    const guildId = params.id

    if (!apiKeyHeader) return new NextResponse('No API key provided', { status: 400 });

    const apiKey = await db.apiKey.findUnique({ where: { key: apiKeyHeader } });
    if (!apiKey) return new NextResponse('Invalid API key', { status: 401 });
    if (apiKey.usage == 750) return new NextResponse('API key usage limit reached (750)', { status: 429 });

    db.apiKey.update({
        where: { key: apiKeyHeader },
        data: { usage: { increment: 1 } }
    }).catch();

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
        await group.updateShout('shout');

        return new NextResponse('Success');
    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    };
};