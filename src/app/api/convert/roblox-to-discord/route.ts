import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) return new NextResponse('No ID provided', {
        status: 400,
    })

    const account = await db.account.findUnique({
        where: {
            id: id
        }
    })
    
    return NextResponse.json(account?.ownerId)
}