import { commands } from "@/commands"
import { getDivisionsCommand } from "@/lib/discord/commands/get-divisions"
import { getRolesCommand } from "@/lib/discord/commands/get-roles"
import { linkCommand } from '@/lib/discord/commands/link'
import { switchCommand } from '@/lib/discord/commands/switch'
import { sendLinkCommand } from '@/lib/discord/commands/send-link'
import { switchComponent } from "@/lib/discord/components/switch"
import { verifyInteractionRequest } from "@/lib/discord/verify-discord-request"
import { InteractionResponseType, InteractionType } from "discord-api-types/v10"
import { NextResponse } from "next/server"
import { shoutCommand } from "@/lib/discord/commands/shout"
import { shoutComponent } from "@/lib/discord/components/shout"
import { promoteCommand } from "@/lib/discord/commands/promote"
import { promoteComponent } from "@/lib/discord/components/promote"

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
        const { name, options } = interaction.data
        switch (name) {
            case commands.link.name:
                return NextResponse.json(await linkCommand(interaction));
            case commands.switch.name:
                return NextResponse.json(await switchCommand(interaction));
            case commands.sendlink.name:
                return NextResponse.json(await sendLinkCommand(interaction));
            case commands.bot.name:
                if (!options) return new NextResponse("Options expected", { status: 400 });

                for (const option of options) {
                    const { name } = option
                    switch (name) {
                        case commands.bot.options[0].name: // shout
                            return NextResponse.json(await shoutCommand(interaction));
                        case commands.bot.options[1].name: // promote
                            return NextResponse.json(await promoteCommand(interaction));
                        case commands.bot.options[2].name: // demote
                            return NextResponse.json(await shoutCommand(interaction));
                    }
                };
            case commands.get.name:
                if (!options) return new NextResponse("Options expected", { status: 400 });

                for (const option of options) {
                    const { name } = option
                    switch (name) {
                        case commands.get.options[0].name: // get divisions
                            return NextResponse.json(await getDivisionsCommand(interaction));
                        case commands.get.options[1].name: // get roles
                            return NextResponse.json(await getRolesCommand(interaction));
                    }
                };
            default:
                return new NextResponse("Unknown command", { status: 400 });
        }
    };

    if (interaction.type === InteractionType.MessageComponent) {
        const { custom_id } = interaction.data
        switch (custom_id) {
            case 'account_switch':
                return NextResponse.json(await switchComponent(interaction))
            default:
                return new NextResponse("Unknown component", { status: 400 });
        }
    }

    if (interaction.type === InteractionType.ModalSubmit) {
        const { custom_id } = interaction.data

        switch (custom_id) {
            case 'shout':
                return NextResponse.json(await shoutComponent(interaction));
            case 'promote':
                return NextResponse.json(await promoteComponent(interaction));
            default:
                return new NextResponse("Unknown modal", { status: 400 });
        }
    };

    return new NextResponse("Unknown command", { status: 400 });
};