import db from '@/lib/db';
import { InteractionResponseType, MessageFlags, APIModalSubmitInteraction, APIInteractionResponse } from 'discord-api-types/v10';
import { generateMessage, MessageTitles, MessageColors, noLinkedAccounts } from '@/lib/discord/messages';
import { Client } from 'bloxy';
import { findAssociatedAccount } from '../util';

export async function promoteComponent(interaction: APIModalSubmitInteraction) {
    const { guild_id, member } = interaction;
    if (!member || !guild_id) return generateMessage({responseType: InteractionResponseType.UpdateMessage, title: MessageTitles.Error, error: { interaction, message: 'Interaction objects not found' }});

    const account = await findAssociatedAccount(member.user.id, guild_id);
    if (!account) return noLinkedAccounts(InteractionResponseType.ChannelMessageWithSource);

    const guild = await db.guild.findUnique({ where: { id: guild_id } });
    if (!guild || !guild.groupId) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoGroupId, flags: MessageFlags.Ephemeral });
    if (!guild.robloxCookie) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoRankBot, flags: MessageFlags.Ephemeral });

    const { components } = interaction.data;
    const promoteTarget = components[0].components[0].value
    const promoteReason = components[0].components[1].value
    let client: Client;

    try {
        client = new Client({ credentials: { cookie: guild.robloxCookie } });
        await client.login();
    } catch (err: any) {
        console.log(err)
        return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.UnableLogin, color: MessageColors.Red });
    };

    try {
        const group = await client.getGroup(parseInt(guild.groupId));
        const member = await group.getMember(parseInt(account.id));
        const targetUserId = await client.getUserIdFromUsername(promoteTarget);
        const targetMember = await group.getMember(targetUserId.id);
        if (!member || !targetMember) throw new Error('No member');

        const role = member.role
        const targetRole = targetMember.role
        if (!role || !role.rank || !targetRole || !targetRole.rank) throw new Error('No role');
        if (role.rank <= targetRole.rank) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoPermission, flags: MessageFlags.Ephemeral });

        const roles = await group.getRoles();
        console.log(roles);
    } catch (err: any) {
        console.log(err)
        return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.UnableShout, color: MessageColors.Red });
    };

    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            embeds: [
                {
                    title: 'Promote Success!',
                    fields: [
                        {name: 'User', value: promoteTarget},
                        {name: 'Reason', value: promoteReason}
                    ],
                    color: MessageColors.Green
                },
            ],
        },
    } satisfies APIInteractionResponse;
};