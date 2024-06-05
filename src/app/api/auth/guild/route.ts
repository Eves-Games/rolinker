import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('guild_id');

    redirect(`https://rolinker.net/manage/server/${query}`)
}