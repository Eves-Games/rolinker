'use server';

import { auth } from '@/auth';
import db from '@/lib/db';
import { rest } from '@/lib/discord';
import { getRoles } from '@/lib/roblox';
import { RESTGetAPIGuildRolesResult, Routes } from 'discord-api-types/v10';

export async function GenDiscordRoles(guildId: string) {
    const session = await auth();

    const guild = await db.guild.findUnique({
        where: {
            id: guildId
        }
    });

    if (!guild || guild.ownerId !== session?.user.id || !guild.groupId) return;;

    const groupRoles = await getRoles(guild.groupId);

    if (!groupRoles) return;

    let guildRoles: Array<string> = [];

    try {
        const guildRolesData: RESTGetAPIGuildRolesResult = await rest.get(Routes.guildRoles(guildId)) as RESTGetAPIGuildRolesResult;
        guildRoles = guildRolesData.map(guildRole => guildRole.name);
    } catch { return };

    const filteredGroupRoles = groupRoles.reverse().filter(groupRole => !guildRoles.includes(groupRole.name));

    filteredGroupRoles.forEach(async groupRole => {
        await rest.post(Routes.guildRoles(guildId), {
            body: {
                name: groupRole.name,
                hoist: true
            }
        }).catch(err => console.log(err))
    })
};