'use server';

import { APIGuild } from "discord-api-types/v10";
import db from "@/lib/db";
import { auth } from "@/auth";

export async function getBotGuild(id: string) {
    const guildRes = await fetch(`https://discord.com/api/v10/guilds/${id}`, {
        headers: {
            Authorization: 'Bot ' + process.env.DISCORD_BOT_TOKEN,
        },
        next: { revalidate: 4 }
    });



    if (!guildRes.ok) {
        delGuildDoc(id)
        return null;
    };

    const guild: APIGuild = await guildRes.json();

    setupGuildDoc(guild)

    return guild;
};

async function delGuildDoc(id: string) {
    try {
        await db.guild.delete({
            where: {
                id: id
            }
        })
    } catch {}
}

async function setupGuildDoc(guild: APIGuild) {
    try {
        await db.guild.create({
            data: {
                id: guild.id,
                ownerId: guild.owner_id
            }
        })
    } catch {}
}

export async function getUserGuild(id: string, access_token: string) {
    const guilds: Array<APIGuild> | null = await getUserGuilds(access_token);

    if (!guilds) {
        return null;
    };

    const guild: APIGuild | undefined = guilds.find(guild => guild.id === id);

    if (!guild) {
        return null;
    };

    return guild;
};

export async function getUserGuilds(access_token: string) {
    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
            Authorization: 'Bearer ' + access_token,
        },
        next: { revalidate: 4 }
    });

    if (!guildsRes.ok) {
        return null;
    };

    const guilds: Array<APIGuild> = await guildsRes.json();

    return guilds;
};

export async function updateGuildGroup(guildId: string, groupId: string) {
    const session = await auth()

    try {
        await db.guild.update({
            where: {
                id: guildId,
                ownerId: session?.user.id
            },
            data: {
                groupId: groupId
            }
        })
    } catch {
        return false;
    }

    return true;
};