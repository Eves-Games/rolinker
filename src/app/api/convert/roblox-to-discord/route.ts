import { prisma } from "@/db"
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) return new Response('No ID provided', {
        status: 400,
    })

    const account = await prisma.account.findUnique({
        where: {
            id: id
        }
    })
    
    return Response.json(account?.ownerId)
}