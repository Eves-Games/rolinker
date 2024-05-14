import { APIChatInputApplicationCommandInteraction, APIInteractionResponse, InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { generateMessage, MessageColors, MessageTitles, noLinkedAccounts } from '../messages';
import db from '@/lib/db';
import { Client } from 'bloxy';
import { findAssociatedAccount } from '../util';

export async function shoutCommand(interaction: APIChatInputApplicationCommandInteraction) {
    const { member, guild_id } = interaction
    if (!guild_id || !member) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.Error, error: { interaction, message: 'Interaction objects not found' } });

    const account = await findAssociatedAccount(member.user.id, guild_id);
    if (!account) return noLinkedAccounts(InteractionResponseType.ChannelMessageWithSource);

    const guild = await db.guild.findUnique({ where: { id: guild_id } });
    if (!guild || !guild.groupId) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoGroupId, flags: MessageFlags.Ephemeral });
    if (!guild.robloxCookie) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoRankBot, flags: MessageFlags.Ephemeral });

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
        if (!member) throw new Error('No member');

        const role = member.role
        if (!role || !role.id) throw new Error('No role');

        const rolePermissions = await group.getRolePermissions(role.id)
        if (!rolePermissions.permissions.groupPostsPermissions.postToStatus) return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.NoPermission, flags: MessageFlags.Ephemeral });
    } catch (err: any) {
        console.log(err)
        return generateMessage({ responseType: InteractionResponseType.ChannelMessageWithSource, title: MessageTitles.UnableShout, color: MessageColors.Red });
    };

    return {
        type: InteractionResponseType.Modal,
        data: {
            custom_id: 'shout',
            title: 'Bot Shout',
            components: [{
                type: 1,
                components: [{
                    type: 4,
                    custom_id: 'content',
                    label: 'Content',
                    style: 2,
                    placeholder: 'Join the game!',
                    max_length: 255
                }]
            }]
        }
    } satisfies APIInteractionResponse;
};