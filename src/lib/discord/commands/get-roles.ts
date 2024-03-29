import db from "@/lib/db";
import { getGroups, getRoles, getUserRoleInGroup } from "@/lib/roblox";
import { APIChatInputApplicationCommandInteraction, InteractionResponseType, RESTGetAPIGuildRolesResult, Routes } from "discord-api-types/v10";
import { errorMessage, noLinkedAccounts, noLinkedGroup, notInGroup, successMessage } from "@/lib/discord/messages";
import { rest } from "@/lib/discord/rest";
import { findAssociatedAccount } from "@/lib/discord/util";

export async function getRolesCommand(interaction: APIChatInputApplicationCommandInteraction) {
    const { member, guild_id } = interaction

    if (!guild_id || !member) return errorMessage(interaction, InteractionResponseType.ChannelMessageWithSource, 'Interaction objects not found');

    const guild = await db.guild.findFirst({
        where: {
            id: guild_id
        }
    });

    if (!guild?.groupId) return noLinkedGroup(InteractionResponseType.ChannelMessageWithSource);

    const account = await findAssociatedAccount(member.user.id, guild_id);

    if (!account) return noLinkedAccounts(InteractionResponseType.ChannelMessageWithSource);

    const groupRanks = await getRoles(guild.groupId);
    const userRank = await getUserRoleInGroup(account.id, guild.groupId);
    const memberRoles = member.roles;

    if (!groupRanks || !userRank) {
        const group = await getGroups([guild.groupId]);

        if (!group) {
            return notInGroup(InteractionResponseType.ChannelMessageWithSource, { name: 'this group', id: guild.groupId, })
        } else {
            return notInGroup(InteractionResponseType.ChannelMessageWithSource, group.data[0]);
        }
    };

    const guildRolesData = await rest.get(Routes.guildRoles(guild_id)).catch(() => { return []; }) as RESTGetAPIGuildRolesResult;

    const removeRanks = groupRanks.filter(rank => rank.id == userRank.id);
    const removeRoles = guildRolesData.filter(role => removeRanks.some(rank => rank.name === role.name)).filter(role => memberRoles.includes(role.name));
    const addRole = guildRolesData.find(role => role.name == userRank.name);

    rest.put(Routes.guildMemberRole(guild_id, member.user.id, addRole!.id)).catch();

    for (const role of removeRoles) {
        rest.delete(Routes.guildMemberRole(guild_id, member.user.id, role.id)).catch();
    };

    return successMessage(InteractionResponseType.ChannelMessageWithSource);
}