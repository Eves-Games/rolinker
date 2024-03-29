import db from "@/lib/db";
import { getGroups, getRoles, getUserRoleInGroup } from "@/lib/roblox";
import { APIChatInputApplicationCommandInteraction, InteractionResponseType, RESTGetAPIGuildRolesResult, Routes } from "discord-api-types/v10";
import { errorMessage, noLinkedAccounts, noLinkedGroup, notInGroup, successMessage } from "@/lib/discord/messages";
import { rest } from "@/lib/discord/rest";

export async function getRolesCommand(interaction: APIChatInputApplicationCommandInteraction) {
    const { member, guild_id } = interaction

    if (!guild_id || !member) return errorMessage(interaction, InteractionResponseType.ChannelMessageWithSource, 'Interaction objects not found');

    const guild = await db.guild.findFirst({
        where: {
            id: guild_id
        }
    });

    if (!guild?.groupId) return noLinkedGroup(InteractionResponseType.ChannelMessageWithSource);

    let account
    const accountGuild = await db.accountGuild.findUnique({
        where: {
            userId_guildId: {
                userId: member.user.id,
                guildId: guild_id
            }
        },
        include: {
            account: true
        }
    });

    if (accountGuild) {
        account = accountGuild.account
    } else {
        account = await db.account.findUnique({
            where: {
                onePrimaryAccountPerUser: {
                    userId: member.user.id,
                    isPrimary: true
                }
            }
        });

        if (!account) return noLinkedAccounts(InteractionResponseType.ChannelMessageWithSource);
    };

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
    const removeRoles = memberRoles.filter(role => removeRanks.some(rank => rank.name === role));
    const addRole = guildRolesData.find(role => role.name == userRank.name);

    rest.put(Routes.guildMemberRole(guild_id, member.user.id, addRole!.id)).catch();

    for (const role of removeRoles) {
        rest.delete(Routes.guildMemberRole(guild_id, member.user.id, role)).catch();
    };

    return successMessage(InteractionResponseType.ChannelMessageWithSource);
}