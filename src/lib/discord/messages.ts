import { APIInteraction, APIInteractionResponse, InteractionResponseType, MessageFlags } from "discord-api-types/v10";

export function errorMessage(interaction: APIInteraction, responseType: InteractionResponseType.UpdateMessage | InteractionResponseType.ChannelMessageWithSource, error?: any): APIInteractionResponse {
    return {
        type: responseType,
        data: {
            embeds: [
                {
                    title: 'Something went wrong!',
                    color: 15548997,
                    fields: error ? [
                        { name: 'Error', value: `\`\`\`${error}\`\`\``, inline: false },
                        { name: 'Guild ID', value: interaction.guild_id || 'Null', inline: true },
                        { name: 'User ID', value: interaction.member?.user.id || 'Null', inline: true },
                    ] : [],
                },
            ],
            flags: MessageFlags.Ephemeral,
        },
    };
}

export function successMessage(responseType: InteractionResponseType.UpdateMessage | InteractionResponseType.ChannelMessageWithSource): APIInteractionResponse {
    return {
        type: responseType,
        data: {
            embeds: [
                {
                    title: 'Success!',
                    color: 5763719,
                }
            ],
            components: []
        }
    };
}