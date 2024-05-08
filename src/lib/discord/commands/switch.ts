import { getDetailedAccounts } from '@/lib/accounts';
import { APIChatInputApplicationCommandInteraction, APIInteractionResponse, InteractionResponseType, MessageFlags, ComponentType } from 'discord-api-types/v10';
import { generateMessage, MessageTitles, noLinkedAccounts } from '../messages';
import db from '@/lib/db';

export async function switchCommand(interaction: APIChatInputApplicationCommandInteraction) {
    const { member, guild_id } = interaction

    if (!guild_id || !member) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.Error, error: { interaction, message: 'Interaction objects not found' } });

    let guild = await db.guild.findUnique({
        where: {
            id: guild_id
        },
        include: {
            parentGuild: true,
            childGuilds: true
        }
    });

    if (!guild?.groupId) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoGroupId, flags: MessageFlags.Ephemeral });

    const detailedAccounts = await getDetailedAccounts(member.user.id);

    if (detailedAccounts.length === 0) return noLinkedAccounts(InteractionResponseType.ChannelMessageWithSource);

    const primaryAccount = detailedAccounts.filter(account => account.isPrimary)[0]

    const accountOptions = detailedAccounts.map(account => {
        return { label: account.name, value: account.id }
    })

    accountOptions.unshift({ label: `Default (${primaryAccount.name})`, value: 'default' })

    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            embeds: [
                {
                    title: 'Select a Roblox Account',
                    description: guild.parentGuild || guild.childGuilds ? `This will change what account is being used in this server, and all servers affiliating with it.` : 'This will change what account is being used only in this server.'
                },
            ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.StringSelect,
                            custom_id: 'account_switch',
                            options: accountOptions,
                        },
                    ],
                },
            ],
            flags: MessageFlags.Ephemeral,
        },
    } satisfies APIInteractionResponse;
};