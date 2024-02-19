import { auth } from "@/auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    if (!id) return new Response('No ID provided', {
        status: 400,
    })

    try {
        const session = await auth();

        const accountToSetPrimary = await db.account.findUnique({
            where: {
                id: id
            }
        });

        if (!accountToSetPrimary) {
            throw new Error('Account not found');
        }

        if (accountToSetPrimary.ownerId !== session?.user.id) {
            throw new Error('Unauthorized access');
        }

        await db.account.updateMany({
            where: {
                ownerId: accountToSetPrimary.ownerId,
                isPrimary: true
            },
            data: {
                isPrimary: false
            }
        });

        await db.account.update({
            where: {
                id: id
            },
            data: {
                isPrimary: true
            }
        });

        return new NextResponse('Success', { status: 200 })
    } catch (error) {
        console.error(error);

        return new NextResponse(`Error: ${error}`, { status: 400 })
    };
}