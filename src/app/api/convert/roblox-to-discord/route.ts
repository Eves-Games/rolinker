import { getDetailedAccounts } from "@/lib/accounts";
import db from "@/lib/db";
import { rest } from "@/lib/discord/rest";
import { findAssociatedAccount } from "@/lib/discord/util";
import { getGroups, getRoles, getUserRoleInGroup } from "@/lib/roblox";
import { APIGuildMember, RESTGetAPIGuildRolesResult, Routes } from "discord-api-types/v10";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('robloxId');

    if (!query) return new NextResponse('No User ID key provided', {
        status: 400,
    });

    const account = await db.account.findUnique({
        where: {
            id: query
        }
    });

    if (!account) {
        return new NextResponse('User not found', { status: 400, });
    };

    return NextResponse.json({ userId: account.userId });
};