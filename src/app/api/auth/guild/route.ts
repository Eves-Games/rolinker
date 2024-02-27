import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const guild_id = searchParams.get('guild_id');

    if (!guild_id) return new NextResponse('No ID provided', {
        status: 400,
    })

    redirect(`/manage/guilds/${guild_id}`);
}