import { getDetailedAccounts } from "@/lib/accounts";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ThumbnailBatchResponse, GetUserResponse } from "roblox-api-types";

export const runtime = "edge";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!params.id) return new NextResponse('No ID provided', {
        status: 400,
    });

    const detailedAccounts = await getDetailedAccounts(params.id)

    return NextResponse.json(detailedAccounts);
};