import db from "@/lib/db";
import { getUserRoles } from "@/lib/roblox";
import {
    APIChatInputApplicationCommandInteraction,
    APIInteractionResponse,
    InteractionResponseType,
    MessageFlags,
    Routes,
    ComponentType,
    ButtonStyle,
    APIInvite,
} from "discord-api-types/v10";
import { errorMessage, noLinkedAccounts, noLinkedGroup, notInGroup, successMessage } from "@/lib/discord/messages";
import { rest } from "@/lib/discord/rest";
import { findAssociatedAccount } from "@/lib/discord/util";
import { RequestData } from "@discordjs/rest";

export async function getDivisionsCommand(interaction: APIChatInputApplicationCommandInteraction) {
    const { member, guild_id } = interaction;
    if (!guild_id || !member) return errorMessage(interaction, InteractionResponseType.ChannelMessageWithSource, 'Interaction objects not found');

    const guild = await db.guild.findUnique({ where: { id: guild_id }, include: { childGuilds: true } });
    if (!guild?.groupId) return noLinkedGroup(InteractionResponseType.ChannelMessageWithSource);

    console.log(guild.groupId)

    const account = await findAssociatedAccount(member.user.id, guild_id);
    if (!account) return noLinkedAccounts(InteractionResponseType.ChannelMessageWithSource);

    console.log(account)

    const userRanks = await getUserRoles(account.id);
    if (!userRanks) return errorMessage(interaction, InteractionResponseType.ChannelMessageWithSource, 'User ranks not found');

    console.log(userRanks)

    const userGroupIds = userRanks.map(userRank => userRank.group.id);
    const applicableGuilds = guild.childGuilds.filter(guild => guild.groupId && guild.inviteChannelId && userGroupIds.includes(parseInt(guild.groupId)));

    console.log(applicableGuilds)

    const invites = await Promise.all(
        applicableGuilds.map(async (guild) => {
            const invite = await rest.post(Routes.channelInvites(guild.inviteChannelId!), { max_age: 120, max_uses: 1, unique: true } as RequestData).catch(() => null);
            return { guild, invite };
        })
    );

    const validInvites = invites.filter((invite): invite is { guild: typeof guild.childGuilds[number]; invite: APIInvite } => invite.invite !== null) as { guild: typeof guild.childGuilds[number]; invite: APIInvite }[];

    console.log(validInvites)

    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            embeds: [
                {
                    title: 'Your Divisions',
                    description: 'Click a button to join that division\'s Discord server.',
                },
            ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: validInvites.map(({ guild, invite }) => ({
                        type: ComponentType.Button,
                        style: ButtonStyle.Link,
                        label: guild.name,
                        url: `https://discord.gg/${invite.code}`,
                        disabled: !invite,
                    })),
                },
            ],
            flags: MessageFlags.Ephemeral,
        },
    } satisfies APIInteractionResponse;
}