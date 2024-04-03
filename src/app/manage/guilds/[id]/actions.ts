'use server';

import { auth } from '@/auth';
import db from '@/lib/db';
import { rest } from '@/lib/discord/rest';
import { getRoles } from '@/lib/roblox';
import { Guild } from '@prisma/client/edge';
import { APIGuild, RESTGetAPIGuildRolesResult, Routes } from 'discord-api-types/v10';

export async function genDiscordRoles(guildId: string) {
    const session = await auth();

    const guild = await rest.get(Routes.guild(guildId)) as APIGuild;

    if (guild.owner_id !== session?.user.id) return;

    const guildData = await db.guild.findUnique({
        where: { id: guildId, }
    });

    if (!guildData?.groupId) return;

    const { groupId } = guildData;

    const groupRoles = await getRoles(groupId);

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

export async function performSave(
    guildId: string,
    submission: {
        group: {
            currentId: string | null;
            newId: string | null;
        };
        parent: {
            currentId: string | null;
            newId: string | null;
        };
        channel: {
            currentId: string | null;
            newId: string | null;
        };
    }
) {
    const session = await auth();
    const guild = await rest.get(Routes.guild(guildId)) as APIGuild;
    if (guild.owner_id !== session?.user.id) return;

    const updateData: Partial<Guild> = {};

    if (submission.group.currentId !== submission.group.newId) {
        updateData.groupId = submission.group.newId;
    };

    if (submission.parent.currentId !== submission.parent.newId && guildId !== submission.parent.newId) {
        updateData.parentGuildId = submission.parent.newId;
    };

    if (submission.channel.currentId !== submission.channel.newId) {
        updateData.inviteChannelId = submission.channel.newId;
    };

    if (Object.keys(updateData).length > 0) {
        await db.guild.update({
            where: { id: guildId },
            data: updateData,
        }).catch();
    };
};

export async function regenerateApiKey(guildId: string): Promise<string | undefined> {
    const session = await auth();
    const guild = await rest.get(Routes.guild(guildId)) as APIGuild;

    if (guild.owner_id !== session?.user.id) return;

    const guildData = await db.guild.update({
        where: { id: guildId },
        data: { apiKey: crypto.randomUUID(), },
    });

    return guildData.apiKey;
};