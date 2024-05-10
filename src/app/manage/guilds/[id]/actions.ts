"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { rest } from "@/lib/discord/rest";
import { getGroupRoles } from "@/lib/roblox";
import { Guild } from "@prisma/client/edge";
import { APIGuild, RESTGetAPIGuildResult, RESTGetAPIGuildRolesResult, Routes } from "discord-api-types/v10";

export async function genDiscordRoles(guildId: string) {
    const session = await auth();

    const guild = await rest.get(Routes.guild(guildId)) as APIGuild;

    if (guild.owner_id !== session?.user.id) return;

    const guildData = await db.guild.findUnique({
        where: { id: guildId, }
    });

    if (!guildData?.groupId) return;

    const { groupId } = guildData;

    const groupRoles = await getGroupRoles(groupId);

    if (!groupRoles) return;

    const guildRolesData = await rest.get(Routes.guildRoles(guildId)).catch(() => { return []; }) as RESTGetAPIGuildRolesResult;
    const guildRoleSet: Set<string> = new Set(guildRolesData.map(guildRole => guildRole.name));
    const newGroupRoles = groupRoles.roles.filter(groupRole => !guildRoleSet.has(groupRole.name));

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
    guildData: Guild
) {
    const session = await auth();
    const guild = await rest.get(Routes.guild(guildData.id)) as RESTGetAPIGuildResult;

    if (guild.owner_id !== session?.user.id) return;

    await db.guild.update({
        where: { id: guildData.id },
        data: guildData,
    }).catch();
};

