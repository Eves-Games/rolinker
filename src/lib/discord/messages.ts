import { APIInteraction, APIInteractionResponse, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { GroupResponseV2 } from "roblox-api-types";

export function notInGroup(responseType: InteractionResponseType.UpdateMessage | InteractionResponseType.ChannelMessageWithSource, group: { id: string; name: string } | GroupResponseV2): APIInteractionResponse {
    return {
        type: responseType,
        data: {
            embeds: [
                {
                    title: 'You are not in this group!',
                    color: 15548997,
                },
                {
                    title: `Want to join ${group.name}?`,
                    url: `https://www.roblox.com/groups/${group.id}/a`,
                    fields: [
                        { name: 'Step 1', value: 'Tap on the title and accept the redirection to the Roblox website.' },
                        { name: 'Step 2', value: 'Click on join group' },
                    ],
                },
            ],
            components: [],
            flags: MessageFlags.Ephemeral,
        },
    } satisfies APIInteractionResponse;
};

export function noLinkedGroup(responseType: InteractionResponseType.UpdateMessage | InteractionResponseType.ChannelMessageWithSource): APIInteractionResponse {
    return {
        type: responseType,
        data: {
            embeds: [
                {
                    title: 'This guild has no linked group!',
                    color: 15548997,
                },
            ],
            components: [],
            flags: MessageFlags.Ephemeral,
        },
    } satisfies APIInteractionResponse;
};

export function noLinkedAccounts(responseType: InteractionResponseType.UpdateMessage | InteractionResponseType.ChannelMessageWithSource): APIInteractionResponse {
    return {
        type: responseType,
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
            components: [],
            flags: MessageFlags.Ephemeral,
        },
    } satisfies APIInteractionResponse;
};

export function errorMessage(interaction: APIInteraction, responseType: InteractionResponseType.UpdateMessage | InteractionResponseType.ChannelMessageWithSource, error?: any): APIInteractionResponse {
    return {
        type: responseType,
        data: {
            embeds: [
                {
                    title: 'Something went wrong!',
                    color: 15548997,
                    fields: error ? [
                        { name: 'Error', value: `\`\`\`${error}\`\`\``, inline: false },
                        { name: 'Guild ID', value: interaction.guild_id || 'Null', inline: true },
                        { name: 'User ID', value: interaction.member?.user.id || 'Null', inline: true },
                    ] : [],
                },
            ],
            components: [],
            flags: MessageFlags.Ephemeral,
        },
    };
};

export function successMessage(responseType: InteractionResponseType.UpdateMessage | InteractionResponseType.ChannelMessageWithSource): APIInteractionResponse {
    return {
        type: responseType,
        data: {
            embeds: [
                {
                    title: 'Success!',
                    color: 5763719,
                }
            ],
            components: [],
            flags: MessageFlags.Ephemeral,
        }
    };
};