'use server';

import { auth } from "@/auth";
import db from "@/lib/db";

export async function deleteAccount() {
    const session = await auth();

    if (!session || !session.user) return;

    const userId = session.user.id;

    await db.$transaction([
        db.apiKey.deleteMany({ where: { userId } }),
        db.accountGuild.deleteMany({ where: { userId } }),
        db.account.deleteMany({ where: { userId } })
    ])
};