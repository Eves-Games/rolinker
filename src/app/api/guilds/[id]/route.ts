import { apiKeyCheck } from "@/lib/api";
import db from "@/lib/db";
import { rest } from "@/lib/discord/rest";
import { RESTGetAPIGuildResult, Routes } from "discord-api-types/v10";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
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

    if (guild) {
        const { robloxCookie, ...guildWithoutCookie } = guild;
        return NextResponse.json(guildWithoutCookie);
    }

    return NextResponse.json(null);
};