'use server';

import db from "@/lib/db";
import { ApiKey } from "@prisma/client/edge";

export async function createApiKey(userId: string, guildId: string): Promise<ApiKey | undefined> {
    const apiKey = generateRandomKey(32);

    const apiKeyCheck = await db.apiKey.findMany({
        where: {
            OR: [
                { key: apiKey },
                { guildId: guildId }
            ]
        }
    });

    if (apiKeyCheck.length > 0) {
        if (apiKeyCheck.some(key => key.guildId === guildId)) {
            return;
        } else {
            return createApiKey(userId, guildId);
        }
    } else {
        const newApiKey = await db.apiKey.create({
            data: {
                userId,
                guildId,
                key: apiKey
            }
        });
        return newApiKey;
    };
};

function generateRandomKey(length: number): string {
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
};