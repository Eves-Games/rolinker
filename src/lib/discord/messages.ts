import { APIInteraction, APIInteractionResponse, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { GroupData } from "../roblox";

export enum MessageTitles {
    Success = 'Success!',
    Error = 'Something went wrong!',

    NoGroupId = 'This guild has no linked group!',
    NoDivisions = 'This guild has no linked divisions!',
    NoRankBot = 'This guild has no linked rank bot!',

    UnableInvites = 'Unable to create invites!',
    UnableRole = 'Unable to give roles!',
    UnableShout = 'Unable to group shout!',
    UnableLogin = 'Unable to log into the rank bot!',
    UnableRank = 'Unable to rank user!',

    NoPermission = 'You have no permission to do this!',
    NoLinkedAccounts = 'You have no linked accounts!',
    NotInDivisions = 'You are not in any divisions!',
    NotInGroup = 'You are not in this guilds linked group!',
    NotOwner = 'You are not the owner of this guild!'
};

export enum MessageColors {
    Red = 15548997,
    Green = 5763719
};

interface MessageProps { responseType: InteractionResponseType.UpdateMessage | InteractionResponseType.ChannelMessageWithSource, title: MessageTitles, color?: MessageColors, flags?: MessageFlags, error?: { message: any, interaction: APIInteraction } }

export function generateMessage({ responseType, title, color, flags, error }: MessageProps): APIInteractionResponse {
    return {
        type: responseType,
        data: {
            embeds: [{
                title, color, fields: error ? [
                    { name: 'Error', value: `\`\`\`${error.message}\`\`\``, inline: false },
                    { name: 'Guild ID', value: error.interaction.guild_id || 'Null', inline: true },
                    { name: 'User ID', value: error.interaction.member?.user.id || 'Null', inline: true },
                ] : [],
            }],
            components: [],
            flags
        },
    };
};

export function notInGroup(responseType: InteractionResponseType.UpdateMessage | InteractionResponseType.ChannelMessageWithSource, group: { id: string; name: string } | GroupData): APIInteractionResponse {
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