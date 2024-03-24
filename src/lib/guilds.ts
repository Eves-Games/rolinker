'use server';

import { APIGuild as OriginalAPIGuild } from "discord-api-types/v10";
import db from "@/lib/db";
import { auth } from "@/auth";

interface APIGuild extends OriginalAPIGuild {
    id: string;
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
        next: { revalidate: 10 }
    });

    if (!guildsRes.ok) {
        return null;
    };

    const guilds: Array<APIGuild> = await guildsRes.json();

    return guilds;
};

export async function updateGuildGroup(guildId: string, groupId: string | null) {
    const session = await auth();

    db.guild.update({
        where: {
            id: guildId,
            ownerId: session?.user.id
        },
        data: {
            groupId: groupId
        }
    }).catch();
};