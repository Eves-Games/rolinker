import { APIChatInputApplicationCommandInteraction, ButtonStyle, ComponentType, InteractionResponseType, MessageFlags, RESTGetAPIGuildResult, RESTPostAPIChannelMessageJSONBody, Routes } from 'discord-api-types/v10';
import { rest } from '@/discord/rest';
import { generateMessage, MessageColors, MessageTitles } from '@/discord/messages';

export async function sendLinkCommand(interaction: APIChatInputApplicationCommandInteraction) {
    const { member, guild_id, channel } = interaction
    if (!guild_id || !member) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.Error, error: { interaction, message: 'Interaction objects not found' }});

    const botGuild = await rest.get(Routes.guild(guild_id)).catch(() => null) as RESTGetAPIGuildResult;
    if (member.user.id !== botGuild?.owner_id) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NotOwner, flags: MessageFlags.Ephemeral })

    await rest.post(Routes.channelMessages(channel.id), {
        body: {
            embeds: [
                {
                    title: 'Link your Roblox account',
                    description: "This server uses RoLinker for verification. Click the button to go to RoLinker.net.",
                    fields: [
                        { name: 'Step 1', value: 'Tap on the title and accept the redirection to the RoLinker website.' },
                        { name: 'Step 2', value: 'Tap the sign in button on the top right of the website, and sign in with Discord.' },
                        { name: 'Step 3', value: "Tap your Discord username, and select 'Manage' from the dropdown." },
                        { name: 'Step 4', value: 'Tap the plus (+) icon to add a new Roblox account.' },
                    ],
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
                            url: 'https://rolinker.net'
                        },
                    ],
                },
            ]
        } satisfies RESTPostAPIChannelMessageJSONBody
      });

    return generateMessage({responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.Success, flags: MessageFlags.Ephemeral, color: MessageColors.Green})
};