import db from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const headersList = headers();
    const apiKeyHeader = headersList.get('Authorization');
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('discordId');

    if (!query) return new NextResponse('No Discord ID key provided', { status: 400, });

    if (!apiKeyHeader) return new NextResponse('No API key provided', { status: 400, });

    const apiKey = await db.apiKey.findUnique({ where: { key: apiKeyHeader } });

    if (!apiKey) return new NextResponse('Invalid API key', { status: 401, });

    if (apiKey.usage == 750) return new NextResponse('API key usage limit reached (750)', { status: 401, });

    db.apiKey.update({
        where: { key: apiKeyHeader },
        data: { usage: { increment: 1 } }
    }).catch();

    const accounts = await db.account.findMany({ where: { userId: query } });

    if (!accounts) { return new NextResponse('Roblox accounts not found', { status: 400, }); };

    return NextResponse.json(accounts);
};