import { APIChatInputApplicationCommandInteraction, APIInteractionResponse, InteractionResponseType, MessageFlags } from 'discord-api-types/v10';

export async function linkCommand(interaction?: APIChatInputApplicationCommandInteraction) {
    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            embeds: [
                {
                    title: 'Click to link a Roblox Account',
                    url: 'https://rolinker.net/manage/accounts'
                },
            ],
            flags: MessageFlags.Ephemeral,
        },
    } satisfies APIInteractionResponse;
};