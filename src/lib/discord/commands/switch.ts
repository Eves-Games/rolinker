import { getDetailedAccounts } from '@/lib/accounts';
import { APIChatInputApplicationCommandInteraction, APIInteractionResponse, InteractionResponseType, MessageFlags, ComponentType } from 'discord-api-types/v10';
import { errorMessage } from '../messages';

export async function switchCommand(interaction: APIChatInputApplicationCommandInteraction) {
    const { member } = interaction

    if (!member) {
        return errorMessage(interaction, InteractionResponseType.ChannelMessageWithSource);
    }

    const detailedAccounts = await getDetailedAccounts(member.user.id);

    if (!detailedAccounts) {
        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                embeds: [
                    {
                        title: 'You have no linked accounts!',
                        color: 15548997,
                    },
                    {
                        title: 'Link a Roblox Account',
                        url: 'https://rolinker.net',
                        fields: [
                            { name: 'Step 1', value: 'Tap on the title and accept the redirection to the RoLinker website.' },
                            { name: 'Step 2', value: 'Tap the sign in button on the top right of the website, and sign in with Discord.' },
                            { name: 'Step 3', value: "Tap your Discord username, and select 'Manage' from the dropdown." },
                            { name: 'Step 4', value: 'Tap the plus (+) icon to add a new Roblox account.' },
                        ],
                    },
                ],
                flags: MessageFlags.Ephemeral,
            },
        } satisfies APIInteractionResponse;
    };

    const primaryAccount = detailedAccounts.filter(account => account.isPrimary)[0]

    const accountOptions = detailedAccounts.map(account => {
        return { label: account.name, value: account.id }
    })

    accountOptions.unshift({label: `Default (${primaryAccount.name})`, value: 'default'})

    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            embeds: [
                {
                    title: 'Select a Roblox Account',
                    description: 'This will change what account is being used only in this server.'
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