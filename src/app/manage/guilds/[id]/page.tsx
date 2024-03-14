import { auth } from '@/auth';
import { getUserGuild } from '@/lib/guilds';
import { PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { APIGuild as OriginalAPIGuild } from 'discord-api-types/v10';
import { Options } from '../_components/Options';
import db from '@/lib/db';
import { GroupBasicResponse, GroupMembershipResponse } from 'roblox-api-types';
import Block from '@/app/_components/Block';
import Image from 'next/image';
import Link from 'next/link';

export const runtime = 'edge';

interface APIGuild extends OriginalAPIGuild {
    id: string;
};

enum GuildStatus {
    NotFound = 'Not Found',
    Unauthorized = 'Unauthorized',
    Authorized = 'Authorized'
};

export default async function Page({ params }: { params: { id: string } }) {
    const session = await auth();

    let guild = await db.guild.findFirst({
        where: {
            id: params.id
        }
    });

    let status = !guild ? GuildStatus.NotFound : (guild.ownerId !== session?.user.id ? GuildStatus.Unauthorized : GuildStatus.Authorized);

    if (status == GuildStatus.NotFound) {
        const userGuild: APIGuild | null = await getUserGuild(params.id, session?.user.access_token);

        if (!userGuild?.owner) {
            status = GuildStatus.Unauthorized
        } else {
            guild = {
                id: userGuild.id,
                name: userGuild.name,
                ownerId: userGuild.owner_id,
                iconUrl: userGuild.icon ? `https://cdn.discordapp.com/icons/${userGuild.id}/${userGuild.icon}.png` : null,
                groupId: null,
                inviteChannelId: null,
                parentGuildId: null,
                accountIds: []
            };
        };
    };

    const guildContent = guild ? (
        <>
            {guild.iconUrl ? (
                <Image src={guild.iconUrl} alt={`${guild.name} Icon`} className='size-16 rounded' width={100} height={100} />
            ) : (
                <span className='size-16 flex items-center text-4xl justify-center'>{guild.name.charAt(0)}</span>
            )
            }
            <span className='text-lg'>{guild.name}</span>
        </>
    ) : (
        <>
            <span className='size-16 flex items-center text-4xl justify-center'>N</span>
            <span className='text-lg'>Not Found</span>
        </>
    );

    if (status == GuildStatus.Unauthorized) {
        return (
            <>
                <Block className='flex space-x-4 py-2 px-4 justify-between items-center w-full'>
                    <div className='flex items-center space-x-4'>
                        <span className='size-16 flex items-center text-4xl justify-center'>U</span>
                        <span className='text-lg'>Unauthorized</span>
                    </div>
                    <div className='flex items-center space-x-4 h-20'>
                        <ExclamationTriangleIcon className='size-6' />
                        <span>You do not have permission to view this guild.</span>
                    </div>
                </Block>
            </>
        );
    } else if (status == GuildStatus.NotFound) {
        return (
            <>
                <div className='flex-col space-y-2 w-full'>
                    <Block className='flex space-x-4 px-4 py-2 justify-between items-center'>
                        <div className='flex items-center space-x-4'>
                            {guildContent}
                        </div>
                        <div className='flex items-center space-x-4'>
                            <ExclamationTriangleIcon className='size-6' />
                            <span>RoLinker bot is not a member of this guild.</span>
                        </div>
                        {guild && (
                            <Link className='flex space-x-4 p-2 hover:bg-neutral-700 rounded' href={`https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id=990855457885278208&permissions=8&guild_id=${params.id}&disable_guild_select=true&redirect_uri=https://rolinker.net/api/auth/guild&response_type=code`}>
                                <PlusIcon className='size-6' />
                                <span>Add Guild</span>
                            </Link>
                        )}
                    </Block>
                </div>
            </>
        );
    };

    const accounts = await db.account.findMany({
        where: {
            userId: session?.user.id
        }
    });

    const ids = accounts.map(account => account.id);

    const ownedGroups: GroupBasicResponse[] = [];
    for (const id of ids) {
        const groupsResponse = await fetch(`https://groups.roblox.com/v2/users/${id}/groups/roles`);
        const groupsData = await groupsResponse.json();
        const userOwnedGroups: GroupMembershipResponse[] = groupsData.data.filter((group: GroupMembershipResponse) => group.role.rank === 255);
        const refinedGroups: GroupBasicResponse[] = userOwnedGroups.map(group => group.group);
        ownedGroups.push(...refinedGroups);
    };

    ownedGroups.unshift({
        id: 0,
        name: 'None',
        memberCount: 0,
        hasVerifiedBadge: false
    });

    const currentGuild = await db.guild.findUnique({
        where: {
            id: params.id
        }
    });

    const currentGroupId = currentGuild?.groupId ? parseInt(currentGuild.groupId) : 0;

    return (
        <div className='flex-col space-y-2 w-full'>
            <Block className='flex space-x-4 py-2 px-4 items-center'>
                {guildContent}
            </Block>
            <Options id={params.id} currentGroupId={currentGroupId} groups={ownedGroups} />
        </div>
    );
};