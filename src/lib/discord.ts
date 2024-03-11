'use server';

import { REST } from '@discordjs/rest';
import { auth } from '@/auth';
import db from '@/lib/db';
import { getRoles } from '@/lib/roblox';
import { RESTGetAPIGuildRolesResult, Routes } from 'discord-api-types/v10';

export const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN as string);

export async function genDiscordRoles(guildId: string) {
    const session = await auth();

    const guild = await db.guild.findFirst({
        where: {
            id: guildId
        }
    });

    if (!guild || guild.ownerId !== session?.user.id || !guild.groupId) return;

    const groupRoles = await getRoles(guild.groupId);

    if (!groupRoles) return;

    const guildRolesData = await rest.get(Routes.guildRoles(guildId)).catch(() => { return []; }) as RESTGetAPIGuildRolesResult;
    const guildRoleSet: Set<string> = new Set(guildRolesData.map(guildRole => guildRole.name));
    const newGroupRoles = groupRoles.reverse().filter(groupRole => !guildRoleSet.has(groupRole.name));

    const roleCreationPromises = newGroupRoles.map(async groupRole => {
        await rest.post(Routes.guildRoles(guildId), {
            body: {
                name: groupRole.name,
                hoist: true
            }
        }).catch();
    });

    await Promise.all(roleCreationPromises);
};