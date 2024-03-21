import { getDetailedAccounts } from "@/lib/accounts";
import db from "@/lib/db";
import { rest } from "@/lib/discord/rest";
import { Routes } from "discord-api-types/v10";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const headersList = headers();
    const apiKeyHeader = headersList.get('api-key');

    if (!apiKeyHeader) return new NextResponse('No API key provided', {
        status: 400,
    });

    if (!params.id) return new NextResponse('No ID provided', {
        status: 400,
    });

    const apiKey = await db.apiKey.findUnique({
        where: {
            key: apiKeyHeader
        }
    });

    if (!apiKey) return new NextResponse('Invalid API key', {
        status: 401,
    });

    if (apiKey.usage == 750) return new NextResponse('API key usage limit reached (750)', {
        status: 401,
    });

    db.apiKey.update({
        where: {
            key: apiKeyHeader
        },
        data: {
            usage: { increment: 1 }
        }
    }).catch();

    try {
        await rest.get(Routes.guildMember(apiKey.guildId, params.id));
    } catch {
        return new NextResponse('User not apart of guild API key is linked too', {
            status: 404,
        });
    };

    const detailedAccounts = await getDetailedAccounts(params.id);

    return NextResponse.json(detailedAccounts);
};