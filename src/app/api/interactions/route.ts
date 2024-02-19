import { commands } from "@/commands"
import { verifyInteractionRequest } from "@/discord/verify-incoming-request"
import {
    APIInteractionDataOptionBase,
    ApplicationCommandOptionType,
    InteractionResponseType,
    InteractionType,
    MessageFlags,
} from "discord-api-types/v10"
import { NextResponse } from "next/server"

export const runtime = "edge"

const ROOT_URL = `https://${process.env.VERCEL_URL}`

function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export async function POST(request: Request) {
    const verifyResult = await verifyInteractionRequest(request, process.env.DISCORD_CLIENT_ID as string)
    if (!verifyResult.isValid || !verifyResult.interaction) {
        return new NextResponse("Invalid request", { status: 401 })
    }
    const { interaction } = verifyResult

    if (interaction.type === InteractionType.Ping) {
        return NextResponse.json({ type: InteractionResponseType.Pong })
    }

    if (interaction.type === InteractionType.ApplicationCommand) {
        const { name } = interaction.data

        switch (name) {
            case commands.ping.name:
                return NextResponse.json({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: { content: `Pong` },
                })

            case commands.link.name:
                return NextResponse.json({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: `Link`,
                        flags: MessageFlags.Ephemeral,
                    },
                })

            case commands.getroles.name:
                return NextResponse.json({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: `Get roles`,
                        flags: MessageFlags.Ephemeral,
                    },
                })

            case commands.getsubguilds.name:
                return NextResponse.json({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: `Get sub-guilds`,
                        flags: MessageFlags.Ephemeral,
                    },
                })

            default:
        }
    }

    return new NextResponse("Unknown command", { status: 400 })
}