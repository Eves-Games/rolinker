import db from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const headersList = headers();
    const apiKeyHeader = headersList.get('api_key');
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('robloxId');

    if (!query) return new NextResponse('No Roblox ID key provided', { status: 400, });

    if (!apiKeyHeader) return new NextResponse('No API key provided', { status: 400, });

    const apiKey = await db.apiKey.findUnique({ where: { key: apiKeyHeader } });

    if (!apiKey) return new NextResponse('Invalid API key', { status: 401, });

    if (apiKey.usage == 750) return new NextResponse('API key usage limit reached (750)', { status: 401, });

    db.apiKey.update({
        where: { key: apiKeyHeader },
        data: { usage: { increment: 1 } }
    }).catch();

    const account = await db.account.findUnique({ where: { id: query } });

    if (!account) { return new NextResponse('Discord user not found', { status: 404, }); };

    return NextResponse.json({ userId: account.userId });
};