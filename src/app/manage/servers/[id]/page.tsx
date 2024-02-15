import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/db";
import { UserGroup } from "@/roblox-api";
import axios from "axios";
import { getServerSession } from "next-auth";
import Image from 'next/image';
import { HashtagIcon, ArrowPathIcon, UserGroupIcon, ServerIcon } from '@heroicons/react/24/outline';
import { StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';

export default async function ManageServerPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(options)

    const guild = await prisma.servers.findUnique({
        where: {
            id: params.id
        }
    })

    if (!guild || guild.ownerId != session?.user.id) {
        return <div>No Permission</div>
    }

    const accounts = await prisma.accounts.findMany({
        where: {
            ownerId: session?.user.discordId
        },
        orderBy: {
            isPrimary: 'desc'
        }
    });

    const userGroupsPromises = accounts.map(account => {
        return axios.get(`https://groups.roblox.com/v2/users/${account.id}/groups/roles?includeLocked=true`);
    });

    const userGroupsResponses = await Promise.all(userGroupsPromises);

    const userGroups: Array<UserGroup> = userGroupsResponses.map(response => response.data.data).reduce((acc, current) => [...acc, ...current], []).filter((userGroup: UserGroup) => userGroup.role.rank == 255);

    return (
        <div className='flex-col space-y-2 w-full'>
            <div className='flex items-center justify-between space-x-4 bg-neutral-800 w-full px-4 py-2 rounded shadow-lg'>
                <div className='flex items-center space-x-4'>
                    {guild.imageUrl ? (
                        <Image src={guild.imageUrl} alt={`${guild.name} Icon`} className='h-16 w-16 rounded' width={100} height={100} />
                    ) : (
                        <div className='h-16 w-16 flex items-center justify-center'>
                            <span className='text-4xl'>{guild.name.charAt(0)}</span>
                        </div>
                    )}
                    <span className='text-lg'>{guild.name}</span>
                </div>
                <button className='flex items-center space-x-2 px-2 py-2 rounded hover:bg-neutral-600'>
                    <ArrowPathIcon className='h-6' />
                    <span>Generate Roles</span>
                </button>
            </div>

            <div className='flex space-x-4 items-start justify-center'>
                <div className='space-y-2 grow'>
                    <div className='px-4 py-2 bg-neutral-800 rounded shadow-lg text-lg text-center'>
                        Link Roblox Group
                    </div>
                    <div className='bg-neutral-800 flex items-center space-x-4 w-full px-4 py-2 rounded shadow-lg'>
                        <SolidStarIcon className='h-6' />
                        <span>Army</span>
                    </div>
                    <div className='bg-neutral-800 rounded shadow-lg overflow-y-scroll h-96 scrollbar-none'>
                        {userGroups.map((userGroup, index) => (
                            <button
                                key={userGroup.group.id}
                                className={`flex items-center space-x-4 w-full px-4 py-2 hover:bg-neutral-600 ${index === 0 ? 'rounded-t' : ''
                                    } ${index === userGroups.length - 1 ? 'rounded-b' : ''
                                    }`}
                            >
                                <UserGroupIcon className='h-6' />
                                <span>{userGroup.group.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className='space-y-2 grow'>
                    <div className='px-4 py-2 bg-neutral-800 rounded shadow-lg text-lg text-center'>
                        Set Invite Channel
                    </div>
                    <div className='bg-neutral-800 flex items-center space-x-4 w-full px-4 py-2 rounded shadow-lg'>
                        <SolidStarIcon className='h-6' />
                        <span>┃📢army-wide</span>
                    </div>
                    <div className='bg-neutral-800 rounded shadow-lg overflow-y-scroll h-96 scrollbar-none'>
                        {userGroups.map((userGroup, index) => (
                            <button
                                key={userGroup.group.id}
                                className={`flex items-center space-x-4 w-full px-4 py-2 hover:bg-neutral-600 ${index === 0 ? 'rounded-t' : ''
                                    } ${index === userGroups.length - 1 ? 'rounded-b' : ''
                                    }`}
                            >
                                <HashtagIcon className='h-6' />
                                <span>{userGroup.group.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className='space-y-2 grow'>
                    <div className='px-4 py-2 bg-neutral-800 rounded shadow-lg text-lg text-center'>
                        Set Parent Server
                    </div>
                    <div className='bg-neutral-800 flex items-center space-x-4 w-full px-4 py-2 rounded shadow-lg'>
                        <SolidStarIcon className='h-6' />
                        <span>Arstotzka</span>
                    </div>
                    <div className='bg-neutral-800 rounded shadow-lg overflow-y-scroll h-96 scrollbar-none'>
                        {userGroups.map((userGroup, index) => (
                            <button
                                key={userGroup.group.id}
                                className={`flex items-center space-x-4 w-full px-4 py-2 hover:bg-neutral-600 ${index === 0 ? 'rounded-t' : ''
                                    } ${index === userGroups.length - 1 ? 'rounded-b' : ''
                                    }`}
                            >
                                <ServerIcon className='h-6' />
                                <span>{userGroup.group.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}