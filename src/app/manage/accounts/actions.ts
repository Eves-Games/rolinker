'use server';

import { auth } from "@/auth";
import db from "@/lib/db";

export async function updatePrimaryAccount(accountId: string) {
    const session = await auth();

    if (!session?.user) return;

    await db.$transaction([
        db.account.update({
            where: {
                onePrimaryAccountPerUser: {
                    userId: session.user.id,
                    isPrimary: true
                }
            },
            data: {
                isPrimary: false
            }
        }),
        db.account.update({
            where: {
                id: accountId,
                userId: session.user.id
            },
            data: {
                isPrimary: true
            }
        })
    ]).catch((error) => console.log(error));
};

export async function deleteAccount(accountId: string) {
    const session = await auth();

    if (!session?.user) return;

    await db.account.delete({
        where: {
            id: accountId,
            userId: session.user.id
        }
    }).catch((error) => console.log(error));
};