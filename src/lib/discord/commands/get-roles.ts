import { APIChatInputApplicationCommandInteraction, APIInteractionResponse, InteractionResponseType, MessageFlags } from "discord-api-types/v10";

export async function getRoles(interaction: APIChatInputApplicationCommandInteraction) {
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