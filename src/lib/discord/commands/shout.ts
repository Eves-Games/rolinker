import { APIChatInputApplicationCommandInteraction, APIGuild, APIInteractionResponse, ButtonStyle, ComponentType, InteractionResponseType, MessageFlags, RESTPostAPIChannelMessageJSONBody, Routes } from 'discord-api-types/v10';
import { rest } from '../rest';
import { generateMessage, MessageColors, MessageTitles } from '../messages';
import db from '@/lib/db';

export async function shoutCommand(interaction: APIChatInputApplicationCommandInteraction) {
    const { member, guild_id, channel } = interaction

    if (!guild_id || !member) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.Error, error: { interaction, message: 'Interaction objects not found' } });

    const guild = await db.guild.findUnique({ where: { id: guild_id } });

    if (!guild || !guild.groupId) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoGroupId, flags: MessageFlags.Ephemeral });
    if (!guild.robloxCookie) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoRankBot, flags: MessageFlags.Ephemeral });

    const res = await fetch(`https://rolinker-ranker-yqb3mestpa-uk.a.run.app/shout?group=${guild.groupId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'roblox-cookie': guild.robloxCookie
        },
        body: JSON.stringify({
            message: 'Test shout'
        })
    });

    if (!res.ok) {
        return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.UnableShout, color: MessageColors.Red });
    };

    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            embeds: [
                {
                    title: 'Shout Success!',
                    fields: [
                        {name: 'Content', value: 'Test shout'}
                    ],
                    color: MessageColors.Green
                },
            ],
        },
    } satisfies APIInteractionResponse;
};