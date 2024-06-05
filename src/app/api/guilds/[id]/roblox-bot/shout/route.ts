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
    const apiKeyResult = await apiKeyCheck(request);
    if (apiKeyResult instanceof NextResponse) return apiKeyResult;
    const { apiKey } = apiKeyResult;

    const guildId = params.id;
    const botGuild = await rest.get(Routes.guild(guildId)).catch(() => { return null; }) as RESTGetAPIGuildResult | null;
    if (!botGuild) return new NextResponse('Could not find guild', { status: 404 });
    if (botGuild.owner_id !== apiKey.userId) return new NextResponse('Unauthorized API key', { status: 401 });

    const guild = await db.guild.findUnique({ where: { id: guildId } });
    if (!guild || !guild.groupId) return new NextResponse('Guild is not linked to a Roblox group', { status: 404 });
    if (!guild.robloxCookie) return new NextResponse('Guild is not linked to a Roblox group', { status: 404 });

    const requestBody = await request.json();
    const shoutContent = requestBody.content;
    if (!shoutContent || typeof shoutContent !== 'string') return new NextResponse('Invalid shout content', { status: 400 });
    if (shoutContent.length > 255) return new NextResponse('Shout content exceeds the maximum length of 255 characters', { status: 400 });

    let client: Client;

    try {
        client = new Client({ credentials: { cookie: guild.robloxCookie } });
        await client.login();
    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    };

    try {
        const group = await client.getGroup(parseInt(guild.groupId));
        await group.updateShout(shoutContent);

        return new NextResponse('Success');
    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    };
};