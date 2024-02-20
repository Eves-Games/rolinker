import { APIChatInputApplicationCommandInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { NextResponse } from "next/server";

export async function getRoles(interaction: APIChatInputApplicationCommandInteraction) {
    const res = await fetch(`https://discord.com/api/v10/guilds/${interaction.guild_id}/members/${interaction.user?.id}/roles/1197897676692398170`, {
        method: 'PUT',
        headers: {
            Authorization: 'Bot ' + process.env.DISCORD_BOT_TOKEN,
        }
    })

    if (!res.ok) {
        return NextResponse.json({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                embeds: [
                    {
                        title: 'Something went wrong!',
                        description: `Guild ID: ${interaction.guild_id}, User ID: ${interaction.user?.id}`,
                        color: 15548997,
                    }
                ],
                flags: MessageFlags.Ephemeral,
            },
        });
    };

    return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: `Get roles`,
            flags: MessageFlags.Ephemeral,
        },
    });
}