import db from '@/lib/db';
import { InteractionResponseType, MessageFlags, APIModalSubmitInteraction, APIInteractionResponse } from 'discord-api-types/v10';
import { generateMessage, MessageTitles, MessageColors } from '@/lib/discord/messages';
import { getRelatedGuilds } from '../util';
import { Client } from 'bloxy';

export async function shoutComponent(interaction: APIModalSubmitInteraction) {
    const { guild_id, member } = interaction;
    if (!member || !guild_id) return generateMessage({responseType: InteractionResponseType.UpdateMessage, title: MessageTitles.Error, error: { interaction, message: 'Interaction objects not found' }});

    const guild = await db.guild.findUnique({ where: { id: guild_id } });
    if (!guild || !guild.groupId) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoGroupId, flags: MessageFlags.Ephemeral });
    if (!guild.robloxCookie) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoRankBot, flags: MessageFlags.Ephemeral });

    const { components } = interaction.data;
    let client: Client;

    try {
        client = new Client({ credentials: { cookie: guild.robloxCookie } });
        await client.login();
    } catch (err: any) {
        console.log(err)
        return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.UnableLogin, color: MessageColors.Red });
    };

    try {
        const group = await client.getGroup(parseInt(guild.groupId));
        console.log(components)
    } catch (err: any) {
        console.log(err)
        return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.UnableShout, color: MessageColors.Red });
    };

    return generateMessage({responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.Success, color: MessageColors.Green})
};