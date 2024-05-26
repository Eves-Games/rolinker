import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    };

    try {
        await db.apiKey.updateMany({
            data: { usage: 0 }
        });

        console.log('API key usage reset successfully');
    } catch (error) {
        console.error('Error resetting API key usage:', error);
    };

    return new NextResponse('Success');
};