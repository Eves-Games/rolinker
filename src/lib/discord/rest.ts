import { REST } from '@discordjs/rest';

export const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN as string);

export const createUserRest = (accessToken: string) => {
    return new REST({ version: '10', authPrefix: 'Bearer' }).setToken(accessToken);
};