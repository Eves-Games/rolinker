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
    RESTPostAPIChannelInviteJSONBody,
} from "discord-api-types/v10";
import { generateMessage, noLinkedAccounts, MessageTitles, MessageColors } from "@/lib/discord/messages";
import { rest } from "@/lib/discord/rest";
import { findAssociatedAccount } from "@/lib/discord/util";
import { RequestData } from "@discordjs/rest";

export async function getDivisionsCommand(interaction: APIChatInputApplicationCommandInteraction) {
    const { member, guild_id } = interaction;
    if (!guild_id || !member) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.Error, error: { interaction, message: 'Interaction objects not found' } });

    const guild = await db.guild.findUnique({ where: { id: guild_id }, include: { childGuilds: true } });
    if (!guild?.groupId) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoGroupId, flags: MessageFlags.Ephemeral });
    if (guild.childGuilds.length === 0) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoDivisions, flags: MessageFlags.Ephemeral });

    const account = await findAssociatedAccount(member.user.id, guild_id);
    if (!account) return noLinkedAccounts(InteractionResponseType.ChannelMessageWithSource);

    const userRanks = await getUserRoles(account.id);
    if (!userRanks) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.Error, error: { interaction, message: 'User ranks not found. The account might be banned.' } });

    const userGroupIds = userRanks.map(userRank => userRank.group.id);
    const applicableGuilds = guild.childGuilds.filter(guild => guild.groupId && guild.inviteChannelId && userGroupIds.includes(parseInt(guild.groupId)));
    if (applicableGuilds.length === 0) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NotInDivisions, flags: MessageFlags.Ephemeral });

    const invites = await Promise.all(
        applicableGuilds.map(async (guild) => {
            const invite = await rest.post(Routes.channelInvites(guild.inviteChannelId!), { body: { max_age: 60, max_uses: 1, unique: true } as RESTPostAPIChannelInviteJSONBody } as RequestData).catch(() => null);
            return { guild, invite };
        })
    );

    const validInvites = invites.filter((invite): invite is { guild: typeof guild.childGuilds[number]; invite: APIInvite } => invite.invite !== null) as { guild: typeof guild.childGuilds[number]; invite: APIInvite }[];
    if (validInvites.length === 0) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.UnableInvites, color: MessageColors.Red });

    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            embeds: [
                {
                    title: 'Your Divisions',
                    description: 'Click a button to join that division\'s Discord server.',
                    footer: { text: 'All links will expire in 1 minute.' }
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