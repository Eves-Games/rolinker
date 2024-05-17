import db from "@/lib/db";
import { rest } from "@/lib/discord/rest";
import { RESTGetAPIGuildResult, Routes } from "discord-api-types/v10";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const headersList = headers();
    const apiKeyHeader = headersList.get('apiKey');
    const searchParams = request.nextUrl.searchParams;
    const memberId = searchParams.get('memberId')
    const guildId = params.id

    if (!memberId || !guildId) return new NextResponse('No User ID key provided', { status: 400, });
    if (!apiKeyHeader) return new NextResponse('No API key provided', { status: 400, });

    const apiKey = await db.apiKey.findUnique({ where: { key: apiKeyHeader } });

    if (!apiKey) return new NextResponse('Invalid API key', { status: 401, });
    if (apiKey.usage == 750) return new NextResponse('API key usage limit reached (750)', { status: 401, });

    db.apiKey.update({
        where: { key: apiKeyHeader },
        data: { usage: { increment: 1 } }
    }).catch();

    const botGuild = await rest.get(Routes.guild(guildId)).catch(() => { return null; }) as RESTGetAPIGuildResult | null;
    if (!botGuild) return new NextResponse('Could not find guild', { status: 404 });
    if (botGuild.owner_id !== apiKey.userId) return new NextResponse('Unauthorized API key', { status: 401 });

    const guild = await db.guild.findUnique({ where: { id: guildId } });

    if (guild) {
        const { robloxCookie, ...guildWithoutCookie } = guild;
        return NextResponse.json(guildWithoutCookie);
    }

    return NextResponse.json(null);
};