import { commands } from "@/commands"
import { getRolesCommand } from "@/lib/discord/commands/get-roles"
import { linkCommand } from '@/lib/discord/commands/link'
import { switchCommand } from '@/lib/discord/commands/switch'
import { verifyInteractionRequest } from "@/lib/discord/verify-discord-request"
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
                return NextResponse.json(await linkCommand(interaction));
            
            case commands.switch.name:
                return NextResponse.json(await switchCommand(interaction));

            case commands.getroles.name:
                return NextResponse.json(await getRolesCommand(interaction));

            case commands.getdivisions.name:
                return NextResponse.json({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: 'Get divisions',
                        flags: MessageFlags.Ephemeral,
                    },
                });

            default:
        }
    };

    return new NextResponse("Unknown command", { status: 400 });
};