'use server';

import { APIGuild } from "discord-api-types/v10";
import db from "@/lib/db";
import { auth } from "@/auth";

enum GuildAuthStatus {
    NotFound = 'Not Found',
    Unauthorized = 'Unauthorized',
    Authorized = 'Authorized',
}

export async function getGuild(guildId: string) {
    const session = await auth();

    const botGuildRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
        headers: {
            Authorization: 'Bot ' + process.env.DISCORD_BOT_TOKEN,
        },
        next: { revalidate: 4 }
    });

    if (!botGuildRes.ok) {
        const userGuild = await getUserGuild(guildId, session?.user.access_token)
        delGuildDoc(guildId)

        if (!userGuild || !userGuild.owner) {
            return { status: GuildAuthStatus.Unauthorized, guild: userGuild }
        }

        return { status: GuildAuthStatus.NotFound, guild: userGuild };
    };

    const botGuild: APIGuild = await botGuildRes.json();
    setupGuildDoc(botGuild);

    if (botGuild.owner_id !== session?.user.id) {
        return { status: GuildAuthStatus.Unauthorized, guild: botGuild };
    };

    return { status: GuildAuthStatus.Authorized, guild: botGuild };
};

async function delGuildDoc(id: string) {
    try {
        await db.guild.delete({
            where: {
                id: id
            }
        })
    } catch { }
}

async function setupGuildDoc(guild: APIGuild) {
    try {
        await db.guild.create({
            data: {
                id: guild.id,
                ownerId: guild.owner_id
            }
        })
    } catch { }
}

async function getUserGuild(id: string, access_token: string) {
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