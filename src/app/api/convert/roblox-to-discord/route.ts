import { apiKeyCheck } from "@/api";
import db from "@/db";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const query = searchParams.get('discordId');
    if (!query) return new NextResponse('No Discord ID key provided', { status: 400, });

    const apiKeyResult = await apiKeyCheck(request);
    if (apiKeyResult instanceof NextResponse) return apiKeyResult;

    const account = await db.account.findUnique({ where: { id: query } });
    if (!account) return new NextResponse('Discord user not found', { status: 404, });

    return NextResponse.json({ userId: account.userId });
};