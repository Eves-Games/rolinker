import { auth } from "@/auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const session = await auth();

    if (!session?.user) return new NextResponse('Unauthorized', {
        status: 401,
    });

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('includeApiKeys')

    const guilds = await db.guild.findMany({
        where: {
            ownerId: session.user.id
        },
        include: {
            apiKey: query == 'true'
        }
    });

    return NextResponse.json(guilds);
};