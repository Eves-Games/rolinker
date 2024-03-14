import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!params.id) return new NextResponse('No ID provided', {
        status: 400,
    });

    const account = await db.account.findUnique({
        where: {
            id: params.id,
        }
    });

    return NextResponse.json(account);
};