import db from '@/lib/db';
import { APIInteractionResponse, InteractionResponseType, APIMessageComponentSelectMenuInteraction } from 'discord-api-types/v10';
import { errorMessage, successMessage } from '@/lib/discord/messages';

export async function switchComponent(interaction: APIMessageComponentSelectMenuInteraction) {
    const { guild_id, member } = interaction
    const { values } = interaction.data

    if (!member || !guild_id) {
        return errorMessage(interaction, InteractionResponseType.UpdateMessage);
    }

    if (values[0] === 'default') {
        try {
            await db.accountGuild.delete({
                where: {
                    userId: member.user.id,
                    guildId: guild_id
                }
            })
        } catch (error) {
            return errorMessage(interaction, InteractionResponseType.UpdateMessage, error);
        };
    } else {
        try {
            await db.accountGuild.upsert({
                where: {
                    userId_guildId: {
                        userId: member.user.id,
                        guildId: guild_id
                    }
                },
                create: {
                    userId: member.user.id,
                    accountId: values[0],
                    guildId: guild_id
                },
                update: {
                    accountId: values[0]
                }
            })
        } catch (error) {
            return errorMessage(interaction, InteractionResponseType.UpdateMessage, error);
        };
    };

    return successMessage(InteractionResponseType.UpdateMessage);
};