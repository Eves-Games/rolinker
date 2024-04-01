'use server';

import { auth } from '@/auth';
import db from '@/lib/db';
import { rest } from '@/lib/discord/rest';
import { getRoles } from '@/lib/roblox';
import { RESTGetAPIGuildRolesResult, Routes } from 'discord-api-types/v10';

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
    const newGroupRoles = groupRoles.filter(groupRole => !guildRoleSet.has(groupRole.name));

    for (const groupRole of newGroupRoles) {
        await rest.post(Routes.guildRoles(guildId), {
            body: {
                name: groupRole.name,
                hoist: true
            }
        }).catch();
    };
};

export async function updateGuildGroup(guildId: string, groupId: string | null) {
    const session = await auth();

    await db.guild.update({
        where: {
            id: guildId,
            ownerId: session?.user.id
        },
        data: {
            groupId: groupId
        }
    }).catch();
};

export async function updateGuildParent(guildId: string, parentGuildId: string | null) {
    const session = await auth();

    if (guildId === parentGuildId) return;

    await db.$transaction(async (tx) => {
        if (parentGuildId) {
            const parentGuild = await tx.guild.findFirst({
                where: {
                    id: parentGuildId,
                    ownerId: session?.user.id,
                },
            });

            if (!parentGuild) return;
        };

        await tx.guild.update({
            where: {
                id: guildId,
                ownerId: session?.user.id,
            },
            data: {
                parentGuildId,
            },
        });
    }).catch();
};