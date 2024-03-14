import { auth } from "@/auth";
import { getDetailedAccounts } from "@/lib/accounts";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
    const session = await auth();

    if (!session?.user) return new NextResponse('Unauthorized', {
        status: 401,
    });

    const detailedAccounts = await getDetailedAccounts(session.user.id)

    return NextResponse.json(detailedAccounts);
};