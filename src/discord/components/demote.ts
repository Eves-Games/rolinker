import db from '@/db';
import { InteractionResponseType, MessageFlags, APIModalSubmitInteraction, APIInteractionResponse } from 'discord-api-types/v10';
import { generateMessage, MessageTitles, MessageColors, noLinkedAccounts } from '@/discord/messages';
import { Client } from 'bloxy';
import { findAssociatedAccount } from '@/discord/util';

export async function demoteComponent(interaction: APIModalSubmitInteraction) {
    const { guild_id, member } = interaction;
    if (!member || !guild_id) return generateMessage({responseType: InteractionResponseType.UpdateMessage, title: MessageTitles.Error, error: { interaction, message: 'Interaction objects not found' }});

    const account = await findAssociatedAccount(member.user.id, guild_id);
    if (!account) return noLinkedAccounts(InteractionResponseType.ChannelMessageWithSource);

    const guild = await db.guild.findUnique({ where: { id: guild_id } });
    if (!guild || !guild.groupId) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoGroupId, flags: MessageFlags.Ephemeral });
    if (!guild.robloxCookie) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoRankBot, flags: MessageFlags.Ephemeral });

    const { components } = interaction.data;
    const target = components[0].components[0].value
    const reason: string | null = components[1].components[0].value
    let client: Client;

    try {
        client = new Client({ credentials: { cookie: guild.robloxCookie } });
        await client.login();
    } catch (err: any) {
        console.log(err);
        return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.UnableLogin, color: MessageColors.Red });
    };

    try {
        const group = await client.getGroup(parseInt(guild.groupId));
        const member = await group.getMember(parseInt(account.id));
        const targetUserId = await client.getUserIdFromUsername(target);
        const targetMember = await group.getMember(targetUserId.id);
        if (!member || !targetMember || member == targetMember) throw new Error('No member');

        const role = member.role
        const targetRole = targetMember.role
        if (!role || !role.rank || !targetRole || !targetRole.rank) throw new Error('No role');
        if (role.rank <= targetRole.rank) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoPermission, flags: MessageFlags.Ephemeral });

        const roles = await group.getRoles();
        const targetRoleIndex = roles.findIndex(role => role.id === targetRole.id);
        const targetNewRole = roles[targetRoleIndex - 1];
        if (!targetNewRole.id) throw new Error('No target role');

        await group.updateMember(targetMember.id, targetNewRole.id)
    } catch (err: any) {
        console.log(err);
        return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.UnableDemote, color: MessageColors.Red });
    };

    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            embeds: [
                {
                    title: 'Demote Success!',
                    fields: [
                        {name: 'User', value: target},
                        {name: 'Reason', value: reason || 'None provided'}
                    ],
                    color: MessageColors.Green
                },
            ],
        },
    } satisfies APIInteractionResponse;
};