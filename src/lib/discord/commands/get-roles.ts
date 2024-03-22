import db from "@/lib/db";
import { getRoles, getUserRoles } from "@/lib/roblox";
import { APIChatInputApplicationCommandInteraction, InteractionResponseType } from "discord-api-types/v10";
import { errorMessage, successMessage } from "@/lib/discord/messages";

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

        return errorMessage(interaction, InteractionResponseType.ChannelMessageWithSource, responseText);
    };

    return successMessage(InteractionResponseType.ChannelMessageWithSource);
}