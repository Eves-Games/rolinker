import { getDetailedAccounts } from '@/lib/accounts';
import { APIChatInputApplicationCommandInteraction, APIInteractionResponse, InteractionResponseType, MessageFlags, ComponentType } from 'discord-api-types/v10';

export async function switchCommand(interaction?: APIChatInputApplicationCommandInteraction) {
    const ownerId = await interaction?.member?.user.id

    if (!ownerId) {
        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                embeds: [
                    {
                        title: 'Something went wrong!',
                        color: 15548997,
                    },
                ],
                flags: MessageFlags.Ephemeral,
            },
        } satisfies APIInteractionResponse;
    }

    const detailedAccounts = await getDetailedAccounts(ownerId);

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

    const accountOptions = detailedAccounts.map(account => {
        return { label: account.name, value: account.id }
    })

    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: 'Please select an option:',
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.StringSelect,
                            custom_id: 'option_select',
                            options: accountOptions,
                        },
                    ],
                },
            ],
            flags: MessageFlags.Ephemeral,
        },
    } satisfies APIInteractionResponse;
};