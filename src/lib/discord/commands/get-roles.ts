import db from "@/lib/db";
import { rest } from '@/lib/discord/rest';
import { getRoles, getUserRoles } from "@/lib/roblox";
import { APIChatInputApplicationCommandInteraction, APIInteractionResponse, InteractionResponseType, MessageFlags, RESTGetAPIGuildRolesResult, Routes } from "discord-api-types/v10";

export async function getRolesCommand(interaction: APIChatInputApplicationCommandInteraction) {
    const guildId = interaction.guild_id;

    if (!guildId) return;

    const guild = await db.guild.findFirst({
        where: {
            id: guildId
        }
    });

    const account = await db.account.findFirst({
        where: {
            userId: interaction.user?.id
        }
    })

    if (!guild?.groupId || !account) return;

    const userRoles = await getUserRoles(account.id) || [];
    const userRoleNames = userRoles.filter(userRole => userRole.group.id.toString() === guild.groupId).map(userRole => userRole.role.name)

    const groupRoles = await getRoles(guild.groupId);
    const groupRoleNames = groupRoles?.map(groupRole => groupRole.name);

    const memberRoles = interaction.member?.roles || [];

    if (!userRoles || !groupRoles || !groupRoleNames) return;

    const memberGroupRoles = memberRoles.filter(memberRole => groupRoleNames.includes(memberRole));
    const removeRoles = memberGroupRoles.map(memberGroupRole => userRoleNames.includes(memberGroupRole))
    const addRole = memberGroupRoles.map(memberGroupRole => !userRoleNames.includes(memberGroupRole))

    console.log(removeRoles, addRole);
    
    const res = await fetch(`https://discord.com/api/v10/guilds/${interaction.guild_id}/members/${interaction.member?.user.id}/roles/1197897676692398170`, {
        method: 'PUT',
        headers: {
            Authorization: 'Bot ' + process.env.DISCORD_BOT_TOKEN,
        }
    });

    if (!res.ok) {
        const responseText = (await res.text()).substring(0, 1024)

        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                embeds: [
                    {
                        title: 'Something went wrong!',
                        color: 15548997,
                        fields: [
                            { name: 'Status', value: res.status.toString(), inline: false },
                            { name: 'Error', value: `\`\`\`${responseText}\`\`\``, inline: false },
                            { name: 'Guild ID', value: interaction.guild_id || 'Null', inline: true },
                            { name: 'User ID', value: interaction.member?.user.id || 'Null', inline: true },
                        ],
                    },
                ],
                flags: MessageFlags.Ephemeral,
            },
        } satisfies APIInteractionResponse;
    };

    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            embeds: [
                {
                    title: 'Success!',
                    color: 5763719,
                }
            ],
            flags: MessageFlags.Ephemeral,
        },
    } satisfies APIInteractionResponse;
}