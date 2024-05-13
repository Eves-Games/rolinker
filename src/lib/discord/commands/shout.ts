import { APIChatInputApplicationCommandInteraction, APIInteractionResponse, InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { generateMessage, MessageTitles } from '../messages';
import db from '@/lib/db';

export async function shoutCommand(interaction: APIChatInputApplicationCommandInteraction) {
    const { member, guild_id } = interaction
    if (!guild_id || !member) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.Error, error: { interaction, message: 'Interaction objects not found' } });

    const guild = await db.guild.findUnique({ where: { id: guild_id } });
    if (!guild || !guild.groupId) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoGroupId, flags: MessageFlags.Ephemeral });
    if (!guild.robloxCookie) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoRankBot, flags: MessageFlags.Ephemeral });

    return {
        type: InteractionResponseType.Modal,
        data: {
            custom_id: 'shout',
            title: 'Group Shout',
            components: [{
                type: 1,
                components: [{
                    type: 4,
                    custom_id: 'content',
                    label: 'Content',
                    style: 2,
                    placeholder: 'Join the game!'
                }]
            }]
        }
    } satisfies APIInteractionResponse;
};