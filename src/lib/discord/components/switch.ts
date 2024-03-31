import db from '@/lib/db';
import { InteractionResponseType, APIMessageComponentSelectMenuInteraction, MessageFlags } from 'discord-api-types/v10';
import { generateMessage, MessageTitles, MessageColors } from '@/lib/discord/messages';
import { getRelatedGuilds } from '../util';

export async function switchComponent(interaction: APIMessageComponentSelectMenuInteraction) {
    const { guild_id, member } = interaction;
    const { values } = interaction.data;

    if (!member || !guild_id) return generateMessage({responseType: InteractionResponseType.UpdateMessage, title: MessageTitles.Error, error: { interaction, message: 'Interaction objects not found' }});

    const guild = await db.guild.findUnique({
        where: { id: guild_id },
        include: { parentGuild: true, childGuilds: true },
    });

    if (!guild?.groupId) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoGroupId, flags: MessageFlags.Ephemeral });

    const relatedGuilds = await getRelatedGuilds(guild_id);
    const relatedGuildIds = relatedGuilds.map((guild) => guild.id);

    if (values[0] === 'default') {
        try {
            await db.accountGuild.deleteMany({
                where: { 
                    userId: member.user.id,
                    guildId: { in: relatedGuildIds },
                },
            });
        } catch (error) {
            return generateMessage({responseType: InteractionResponseType.UpdateMessage, title: MessageTitles.Error, error: { interaction, message: error }});
        }
    } else {
        try {
            for (const guildId of relatedGuildIds) {
                await db.accountGuild.upsert({
                    where: { userId_guildId: { userId: member.user.id, guildId } },
                    update: { accountId: values[0] },
                    create: { userId: member.user.id, accountId: values[0], guildId },
                });
            }
        } catch (error) {
            return generateMessage({responseType: InteractionResponseType.UpdateMessage, title: MessageTitles.Error, error: { interaction, message: error }});
        }
    };

    return generateMessage({ responseType: InteractionResponseType.UpdateMessage, title: MessageTitles.Success, color: MessageColors.Green, flags: MessageFlags.Ephemeral });
};