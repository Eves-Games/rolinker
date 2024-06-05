import db from '@/db';
import { RESTGetAPIGuildResult, Routes } from 'discord-api-types/v10';
import { Client } from 'bloxy';
import { NextRequest, NextResponse } from 'next/server';
import { rest } from '@/discord/rest';
import { apiKeyCheck } from '@/api';

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

    const rank = searchParams.get('rank');
    if (!robloxId) return new NextResponse('No Rank provided', { status: 400 });

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
        const targetMember = await group.getMember(parseInt(robloxId));
        if (!targetMember) throw new Error('No member');

        const roles = await group.getRoles();
        const targetRole = roles.find(role => role.rank === rank);
        if (!targetRole || !targetRole.id) throw new Error('No target role');

        await group.updateMember(targetMember.id, targetRole.id);

        return new NextResponse('Success');
    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    };
};