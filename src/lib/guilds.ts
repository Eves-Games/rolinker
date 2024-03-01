export async function getBotGuild(id: string) {
    'use server';

    const guildRes = await fetch(`https://discord.com/api/v10/guilds/${id}`, {
        headers: {
            Authorization: 'Bot ' + process.env.DISCORD_BOT_TOKEN,
        }
    });

    if (!guildRes.ok) {
        return null;
    };

    const guild = await guildRes.json();

    return guild;
};

export async function getUserGuilds(access_token: string) {
    'use server';
    
    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
            Authorization: 'Bearer ' + access_token,
        }
    });

    if (!guildsRes.ok) {
        return null;
    };

    const guilds = await guildsRes.json();

    return guilds;
};