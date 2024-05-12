import db from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import bloxy from "bloxy";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const headersList = headers();

    const apiKeyHeader = headersList.get('Authorization');
    const guildId = params.id

    if (!apiKeyHeader) return new NextResponse('No API key provided', { status: 400 });

    const apiKey = await db.apiKey.findUnique({ where: { key: apiKeyHeader } });
    if (!apiKey) return new NextResponse('Invalid API key', { status: 401 });
    if (apiKey.usage == 750) return new NextResponse('API key usage limit reached (750)', { status: 429 });

    db.apiKey.update({
        where: { key: apiKeyHeader },
        data: { usage: { increment: 1 } }
    }).catch();

    const guild = await db.guild.findUnique({ where: { id: guildId } });
    if (!guild || !guild.groupId) return new NextResponse('Guild is not linked to a Roblox group', { status: 404 });
    if (!guild.robloxCookie) return new NextResponse('Guild is not linked to a Roblox group', { status: 404 });

    try {
        const client = await new bloxy.Client({ credentials: { cookie: guild.robloxCookie } });
        await client.login();
        const group = await client.getGroup(parseInt(guild.groupId));
        await group.updateShout('shout');
        return new NextResponse('Success');
    } catch (err) {
        return NextResponse.json(err, { status: 500 })
    };
};