import { APIChatInputApplicationCommandInteraction, APIGuild, ButtonStyle, ComponentType, InteractionResponseType, MessageFlags, RESTPostAPIChannelMessageJSONBody, Routes } from 'discord-api-types/v10';
import { rest } from '../rest';
import { generateMessage, MessageColors, MessageTitles } from '../messages';

export async function sendLinkCommand(interaction: APIChatInputApplicationCommandInteraction) {
    const { member, guild_id, channel } = interaction

    if (!guild_id || !member) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.Error, error: { interaction, message: 'Interaction objects not found' }});

    const botGuild = await rest.get(Routes.guild(guild_id)).catch(() => null) as APIGuild | null;
    
    if (member.user.id !== botGuild?.owner_id) {
        return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NotOwner, flags: MessageFlags.Ephemeral })
    }

    await rest.post(Routes.channelMessages(channel.id), {
        body: {
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
        } satisfies RESTPostAPIChannelMessageJSONBody
      });

    return generateMessage({responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.Success, flags: MessageFlags.Ephemeral, color: MessageColors.Green})
};