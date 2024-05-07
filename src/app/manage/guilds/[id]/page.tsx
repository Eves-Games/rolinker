import { auth } from '@/auth';
import { ExclamationTriangleIcon, PlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { APITextChannel, APIGuild as OriginalAPIGuild, Routes } from 'discord-api-types/v10';
import { createUserRest, rest } from '@/lib/discord/rest';
import db from '@/lib/db';
import { GroupBasicResponse } from 'roblox-api-types';
import { getUserRoles } from '@/lib/roblox';
import Options from './Options';
import Link from 'next/link';
import { Metadata } from 'next';

export const runtime = 'edge';

export interface APIGuild extends OriginalAPIGuild {
    id: string;
};

export const revalidate = 600;

export async function generateStaticParams() {
    const guilds = await db.guild.findMany()

    return guilds.map(guild => ({
        id: guild.id
    }))
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const botGuild = await rest.get(Routes.guild(params.id)).catch(() => null) as APIGuild | null;

    return {
        title: 'Manage ' + botGuild?.name || 'Guild'
    }
}

export default async function Page({ params }: { params: { id: string } }) {
    const session = await auth();

    const userRest = createUserRest(session?.user.access_token);
    let userGuilds = await userRest.get(Routes.userGuilds()) as APIGuild[];
    userGuilds.filter(guild => guild.owner === true);

    const guild = userGuilds.find(guild => guild.id === params.id)
    const botGuild = await rest.get(Routes.guild(params.id)).catch(() => null) as APIGuild | null;

    if (!guild) {
        return (
            <div className='flex justify-center items-center space-x-4 border-dashed border-4 border-neutral-800 rounded shadow-lg w-full h-20'>
                <ExclamationTriangleIcon className='size-6' />
                <span>Unauthorized</span>
            </div>
        );
    } else if (!botGuild) {
        return (
            <Link href={`https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id=990855457885278208&permissions=8&guild_id=${guild.id}&disable_guild_select=true&redirect_uri=https://rolinker.net/api/auth/guild&response_type=code`} className='flex justify-center items-center space-x-4 border-dashed border-4 border-neutral-800 hover:bg-neutral-700 rounded shadow-lg w-full h-20'>
                <PlusIcon className='size-6' />
                <span>Add Guild</span>
            </Link>
        );
    };

    const guildData = await db.guild.findUnique({
        where: { id: guild.id }
    }) ?? await db.guild.create({
        data: { id: guild.id }
    });

    const { groupId, inviteChannelId, parentGuildId } = guildData;

    const accounts = await db.account.findMany({
        where: { userId: session?.user.id }
    });

    const ids = accounts.map(account => account.id);

    const userGroups: GroupBasicResponse[] = [];

    for (const id of ids) {
        const groupMemberships = await getUserRoles(id);
        if (groupMemberships === null) continue;
        const groups = groupMemberships.map(group => group.group);
        userGroups.push(...groups);
    };

    const groups = {
        currentGroupId: groupId,
        userGroups: userGroups
    };

    const guilds = {
        currentParentId: parentGuildId,
        userGuilds: userGuilds
    };

    const guildChannels = await rest.get(Routes.guildChannels(guild.id)) as APITextChannel[];
    const textChannels: APITextChannel[] = guildChannels.filter(channel => channel.type === 0);

    const channels = {
        currentChannelId: inviteChannelId,
        guildChannels: textChannels
    };

    return (
        <div className='w-full space-y-2'>
            <div className='flex items-center space-x-4 bg-neutral-800 px-4 py-2 rounded shadow-lg w-full' key={guild.id}>
                {guild.icon ? (
                    <Image src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={`${guild.name} Icon`} className='size-16 rounded' width={100} height={100} />
                ) : (
                    <div className='size-16 flex items-center justify-center'>
                        <span className='text-4xl'>{guild.name.charAt(0)}</span>
                    </div>
                )}
                <span className='text-lg'>{guild.name}</span>
            </div>
            <Options guildId={guild.id} groups={groups} guilds={guilds} channels={channels} />
        </div>
    );
};