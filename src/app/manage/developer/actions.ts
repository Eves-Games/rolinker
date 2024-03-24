'use server';

import { auth } from "@/auth";
import db from "@/lib/db";
import { Guild } from "@prisma/client/edge";

export async function disableApiKey(guildId: string) {
    const session = await auth();

    if (!session?.user.id) return;

    await db.guild.update({
        where: {
            id: guildId
        },
        data: {
            apiKey: null
        }
    });
};

export async function generateApiKey(guildId: string): Promise<Guild | undefined> {
    const session = await auth();

    if (!session?.user.id) return;

    const newApiKey = await generateUniqueKey();

    const guildWithKey = await db.guild.update({
        where: {
            id: guildId
        },
        data: {
            apiKey: newApiKey
        }
    });

    return guildWithKey;
};

async function generateUniqueKey(): Promise<string> {
    const length = 32;
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
    const apiKey = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');

    const apiKeyExists = await db.guild.findUnique({
        where: {
            apiKey: apiKey
        }
    });

    if (apiKeyExists) {
        return generateUniqueKey();
    }

    return apiKey;
}