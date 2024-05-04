'use server';

import { auth } from "@/auth";
import db from "@/lib/db";

export async function regenerateApiKey(userId: string): Promise<string | undefined> {
    const session = await auth();

    if (userId !== session?.user.id) return;

    const guildData = await db.apiKey.update({
        where: { userId: userId },
        data: { key: crypto.randomUUID(), },
    });

    return guildData.key;
};