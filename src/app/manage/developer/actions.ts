'use server';

import { auth } from "@/auth";
import db from "@/lib/db";
import { ApiKey } from "@prisma/client/edge";

export async function disableApiKey(guildId: string) {
    const session = await auth();

    if (!session?.user.id) return;

    await db.apiKey.update({
        where: {
            guildId
        },
        data: {
            key: ''
        }
    });
};

export async function enableApiKey(guildId: string): Promise<ApiKey | undefined> {
    const session = await auth();

    if (!session?.user.id) return;

    const apiKeyGuild = await db.apiKey.findUnique({
        where: {
            guildId
        }
    });

    const newApiKey = await generateUniqueKey();
    let newApiKeyObj: ApiKey

    if (apiKeyGuild) {
        newApiKeyObj = await db.apiKey.update({
            where: {
                guildId
            },
            data: {
                key: newApiKey
            }
        });
    } else {
        newApiKeyObj = await db.apiKey.create({
            data: {
                userId: session!.user.id,
                guildId,
                key: newApiKey
            }
        });
    }

    return newApiKeyObj;
};

async function generateUniqueKey(): Promise<string> {
    const length = 32;
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
    const apiKey = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');

    const apiKeyExists = await db.apiKey.findUnique({
        where: {
            key: apiKey
        }
    });

    if (apiKeyExists) {
        return generateUniqueKey();
    }

    return apiKey;
}