import { commands } from "@/commands"
import { getDivisionsCommand } from "@/lib/discord/commands/get-divisions"
import { getRolesCommand } from "@/lib/discord/commands/get-roles"
import { linkCommand } from '@/lib/discord/commands/link'
import { switchCommand } from '@/lib/discord/commands/switch'
import { sendLinkCommand } from '@/lib/discord/commands/send-link'
import { switchComponent } from "@/lib/discord/components/switch"
import { verifyInteractionRequest } from "@/lib/discord/verify-discord-request"
import {
    APIInteractionResponse,
    InteractionResponseType,
    InteractionType,
} from "discord-api-types/v10"
import { NextResponse } from "next/server"
import { shoutCommand } from "@/lib/discord/commands/shout"

export async function POST(request: Request) {
    const verifyResult = await verifyInteractionRequest(request, process.env.DISCORD_PUBLIC_KEY as string);
    if (!verifyResult.isValid || !verifyResult.interaction) {
        return new NextResponse("Invalid request", { status: 401 })
    };
    const { interaction } = verifyResult;

    if (interaction.type === InteractionType.Ping) {
        return NextResponse.json({ type: InteractionResponseType.Pong })
    };

    if (interaction.type === InteractionType.MessageComponent) {
        const { custom_id } = interaction.data

        switch (custom_id) {
            case 'account_switch':
                return NextResponse.json(await switchComponent(interaction))
        }
    }

    if (interaction.type === InteractionType.ApplicationCommand) {
        const { name } = interaction.data

        switch (name) {
            case commands.ping.name:
                return NextResponse.json({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: { content: 'Pong' },
                } satisfies APIInteractionResponse);

            case commands.link.name:
                return NextResponse.json(await linkCommand(interaction));

            case commands.switch.name:
                return NextResponse.json(await switchCommand(interaction));

            case commands.getroles.name:
                return NextResponse.json(await getRolesCommand(interaction));

            case commands.getdivisions.name:
                return NextResponse.json(await getDivisionsCommand(interaction));

            case commands.sendlink.name:
                return NextResponse.json(await sendLinkCommand(interaction));
            
            case commands.shout.name:
                return NextResponse.json(await shoutCommand(interaction));

            default:
        }
    };

    return new NextResponse("Unknown command", { status: 400 });
};