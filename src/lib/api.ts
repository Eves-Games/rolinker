import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function apiKeyCheck(request: NextRequest) {
    const apiKeyHeader = request.headers.get('apiKey');
    if (!apiKeyHeader) return new NextResponse('No API key provided', { status: 400 });

    const apiKey = await db.apiKey.findUnique({ where: { key: apiKeyHeader } });
    if (!apiKey) return new NextResponse('Invalid API key', { status: 401 });

    if (apiKey.usage >= 750) return new NextResponse('API key usage limit reached (750)', { status: 429 });

    await db.apiKey.update({
        where: { key: apiKeyHeader },
        data: { usage: { increment: 1 } }
    }).catch();

    return { apiKey };
};