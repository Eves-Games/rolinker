import db from "@/lib/db";
import { rest } from "@/lib/discord/rest";
import { findAssociatedAccount } from "@/lib/discord/util";
import { APIGuildMember, Routes } from "discord-api-types/v10";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const headersList = headers();
    const apiKeyHeader = headersList.get('Authorization');
    const searchParams = request.nextUrl.searchParams;
    const memberId = searchParams.get('memberId')
    const guildId = params.id

    if (!memberId || !guildId) return new NextResponse('No User ID key provided', {
        status: 400,
    });

    if (!apiKeyHeader) return new NextResponse('No API key provided', {
        status: 400,
    });

    const apiKey = await db.apiKey.findUnique({
        where: { key: apiKeyHeader }
    });

    if (!apiKey) return new NextResponse('Invalid API key', {
        status: 401,
    });

    if (apiKey.usage == 750) return new NextResponse('API key usage limit reached (750)', {
        status: 401,
    });

    db.apiKey.update({
        where: { key: apiKeyHeader },
        data: { usage: { increment: 1 } }
    }).catch();

    const member = await rest.get(Routes.guildMember(guildId, memberId)).catch(() => { return null; }) as APIGuildMember;

    if (!member) {
        return new NextResponse('User not apart of guild API key is linked too', { status: 404, });
    };

    const account = await findAssociatedAccount(memberId, guildId);

    if (account) {
        const { userId, ...refinedAccount } = account;
        return NextResponse.json(refinedAccount);
      } else {
        return new NextResponse('Associated account not found', { status: 404 });
      }
};