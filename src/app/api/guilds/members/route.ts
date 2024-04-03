import db from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const headersList = headers();
    const apiKeyHeader = headersList.get('Authorization');
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('userId');

    if (!query) return new NextResponse('No User ID key provided', {
        status: 400,
    });

    if (!apiKeyHeader) return new NextResponse('No API key provided', {
        status: 400,
    });

    const guildApiKey = await db.guild.findUnique({
        where: {
            apiKey: apiKeyHeader
        }
    });

    if (!guildApiKey) return new NextResponse('Invalid API key', {
        status: 401,
    });

    if (guildApiKey.apiKeyUsage == 750) return new NextResponse('API key usage limit reached (750)', {
        status: 401,
    });

    db.guild.update({
        where: {
            apiKey: apiKeyHeader
        },
        data: {
            apiKeyUsage: { increment: 1 }
        }
    }).catch();

    const guild = guildApiKey;
    const { apiKey, ...guildWithoutApiKey } = guild;
    
    return NextResponse.json(guildWithoutApiKey);
};