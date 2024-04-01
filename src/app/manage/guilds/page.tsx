import { auth } from '@/auth';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ClientPage from './client-page';
import db from '@/lib/db';
import { GroupBasicResponse, GroupMembershipResponse } from 'roblox-api-types';
import { Guild } from '@prisma/client/edge';
import { rest } from '@/lib/discord/rest';
import { APITextChannel, RESTGetAPIGuildChannelsResult, Routes } from 'discord-api-types/v10';

export const runtime = 'edge';

interface GuildExtended extends Guild {
    parentGuild: GuildExtended | null;
    inviteChannel: APITextChannel | null;
    channels: APITextChannel[];
};

export default async function Page() {
    const session = await auth();

    const guilds = await db.guild.findMany({
        where: { ownerId: session?.user.id },
        include: { parentGuild: true }
    }) as GuildExtended[];

    const accounts = await db.account.findMany({
        where: {
            userId: session?.user.id
        }
    });

    for (const guild of guilds) {
        const channels = await rest.get(Routes.guildChannels(guild.id)) as RESTGetAPIGuildChannelsResult;
        const textChannels = channels.filter(channel => channel.type === 0) as APITextChannel[];
        guild.channels = textChannels;
        const inviteChannel = textChannels.find(channel => channel.id === guild.inviteChannelId) || null;
        guild.inviteChannel = inviteChannel;
    };

    const ids = accounts.map(account => account.id);

    const userGroups: GroupBasicResponse[] = [];
    for (const id of ids) {
        const groupsResponse = await fetch(`https://groups.roblox.com/v2/users/${id}/groups/roles`);
        const groupsData = await groupsResponse.json();
        const refinedGroups = groupsData.data.map((group: GroupMembershipResponse) => group.group);
        userGroups.push(...refinedGroups);
    };

    if (guilds?.length == 0) {
        return (
            <Link className='flex space-x-4 px-4 py-2 justify-center items-center border-dashed border-4 border-neutral-800 rounded shadow-lg hover:border-neutral-700 h-20' href='https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id=990855457885278208&permissions=8&disable_guild_select=true&redirect_uri=https://rolinker.net/api/auth/guild&response_type=code'>
                <PlusIcon className='size-6' />
                <span>Add Guild</span>
            </Link>
        );
    };

    return (
        <ClientPage guilds={guilds} groups={userGroups} />
    );
};