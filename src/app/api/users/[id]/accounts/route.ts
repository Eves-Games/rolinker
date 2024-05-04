import { getDetailedAccounts } from "@/lib/accounts";
import db from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const headersList = headers();
    const apiKeyHeader = headersList.get('Authorization');
    const userId = params.id

    if (!userId) return new NextResponse('No User ID provided', {
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

    const detailedAccounts = await getDetailedAccounts(apiKey.userId);

    return NextResponse.json(detailedAccounts);
};