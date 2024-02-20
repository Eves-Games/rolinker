import { commands } from "@/commands"
import { getRoles } from "@/lib/commands/get-roles"
import { link } from '@/lib/commands/link'
import { verifyInteractionRequest } from "@/lib/verify-discord-request"
import {
    InteractionResponseType,
    InteractionType,
    MessageFlags,
} from "discord-api-types/v10"
import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: Request) {
    const verifyResult = await verifyInteractionRequest(request, process.env.DISCORD_PUBLIC_KEY as string);
    if (!verifyResult.isValid || !verifyResult.interaction) {
        return new NextResponse("Invalid request", { status: 401 })
    };
    const { interaction } = verifyResult;

    if (interaction.type === InteractionType.Ping) {
        return NextResponse.json({ type: InteractionResponseType.Pong })
    };

    if (interaction.type === InteractionType.ApplicationCommand) {
        const { name } = interaction.data

        switch (name) {
            case commands.ping.name:
                return NextResponse.json({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: { content: 'Pong' },
                });

            case commands.link.name:
                return NextResponse.json(await link());

            case commands.getroles.name:
                return NextResponse.json(await getRoles(interaction));

            case commands.getsubguilds.name:
                return NextResponse.json({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: `Get sub-guilds`,
                        flags: MessageFlags.Ephemeral,
                    },
                });

            default:
        }
    }

    return new NextResponse("Unknown command", { status: 400 });
}