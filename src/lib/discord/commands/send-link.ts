import { APIChatInputApplicationCommandInteraction, APIGuild, APIInteractionResponse, ButtonStyle, ComponentType, InteractionResponseType, MessageFlags, Routes } from 'discord-api-types/v10';
import { rest } from '../rest';
import { generateMessage, MessageTitles } from '../messages';

export async function sendLinkCommand(interaction: APIChatInputApplicationCommandInteraction) {
    const { member, guild_id } = interaction

    if (!guild_id || !member) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.Error, error: { interaction, message: 'Interaction objects not found' }});

    const botGuild = await rest.get(Routes.guild(guild_id)).catch(() => null) as APIGuild | null;
    
    if (member.user.id !== botGuild?.owner_id) {
        return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NotOwner, flags: MessageFlags.Ephemeral })
    }

    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            embeds: [
                {
                    title: 'Link your Roblox account',
                    description: "This server uses RoLinker for verification. Click below to link your Discord to your Roblox account."
                },
            ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Link,
                            label: 'Link Account',
                            url: 'https://rolinker.net/manage/accounts'
                        },
                    ],
                },
            ]
        },
    } satisfies APIInteractionResponse;
};