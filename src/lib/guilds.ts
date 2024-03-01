import { APIGuild } from "discord-api-types/v10";

export async function getBotGuild(id: string) {
    'use server';

    const guildRes = await fetch(`https://discord.com/api/v10/guilds/${id}`, {
        headers: {
            Authorization: 'Bot ' + process.env.DISCORD_BOT_TOKEN,
        },
        next: { revalidate: 4 }
    });

    if (!guildRes.ok) {
        return null;
    };

    const guild: APIGuild = await guildRes.json();

    return guild;
};

export async function getUserGuild(id: string, access_token: string) {
    'use server';

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
    'use server';

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