import { APIInteractionResponse, InteractionResponseType, MessageFlags } from "discord-api-types/v10";

export async function link() {
    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            embeds: [
                {
                    title: 'Link a Roblox Account',
                    url: 'https://rolinker.net',
                    fields: [
                        { name: 'Step 1', value: 'Tap on the link button and accept the redirection to the RoLinker website.' },
                        { name: 'Step 2', value: 'Tap the sign in button on the top right of the website, and sign in with Discord.' },
                        { name: 'Step 3', value: "Tap your Discord username, and select 'Manage' from the dropdown." },
                        { name: 'Step 4', value: 'Tap the plus (+) icon to add a new Roblox account.' },
                    ],
                },
            ],
            flags: MessageFlags.Ephemeral,
        },
    } satisfies APIInteractionResponse;
}