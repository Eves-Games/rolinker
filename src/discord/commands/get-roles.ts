import db from "@/db";
import { APIChatInputApplicationCommandInteraction, InteractionResponseType, MessageFlags, RESTGetAPIGuildRolesResult, Routes } from "discord-api-types/v10";
import { generateMessage, MessageColors, MessageTitles, noLinkedAccounts, notInGroup } from "@/discord/messages";
import { rest } from "@/discord/rest";
import { findAssociatedAccount } from "@/discord/util";
import { getGroupRoles, getGroups, getUserRoles } from "@/roblox";

export async function getRolesCommand(interaction: APIChatInputApplicationCommandInteraction) {
    const { member, guild_id } = interaction
    if (!guild_id || !member) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.Error, error: { interaction, message: 'Interaction objects not found' } });

    const guild = await db.guild.findUnique({ where: { id: guild_id } });
    if (!guild || !guild.groupId) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoGroupId, flags: MessageFlags.Ephemeral });

    const account = await findAssociatedAccount(member.user.id, guild_id);
    if (!account) return noLinkedAccounts(InteractionResponseType.ChannelMessageWithSource);

    const groupRoles = await getGroupRoles(guild.groupId);
    const userRoles = await getUserRoles(account.id);
    const userRole = userRoles.data.find(role => role.group.id === parseInt(guild.groupId!));
    const memberRoles = member.roles;

    if (!groupRoles || !userRole) {
        const group = await getGroups([guild.groupId]);

        if (!group) return notInGroup(InteractionResponseType.ChannelMessageWithSource, { id: guild.groupId, name: 'this group' })
        return notInGroup(InteractionResponseType.ChannelMessageWithSource, group.data[0]);
    };
    
    const guildRolesData = await rest.get(Routes.guildRoles(guild_id)).catch(() => { return []; }) as RESTGetAPIGuildRolesResult;

    const removeRanks = groupRoles.roles.filter(role => role.id == userRole.role.id);
    const removeRoles = guildRolesData.filter(role => removeRanks.some(rank => rank.name === role.name)).filter(role => memberRoles.includes(role.name));
    const addRole = guildRolesData.find(role => role.name == userRole.role.name);

    try {
        await rest.put(Routes.guildMemberRole(guild_id, member.user.id, addRole!.id)).catch();

        for (const role of removeRoles) await rest.delete(Routes.guildMemberRole(guild_id, member.user.id, role.id)).catch();
    } catch {
        return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.UnableRole, color: MessageColors.Red });
    };

    return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.Success, color: MessageColors.Green, flags: MessageFlags.Ephemeral });
}