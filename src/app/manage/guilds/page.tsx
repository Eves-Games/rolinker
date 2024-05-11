import { auth } from '@/auth';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { RESTGetAPICurrentUserGuildsResult, Routes } from 'discord-api-types/v10';
import { createUserRest } from '@/lib/discord/rest';

export const runtime = 'edge';

export default async function Page() {
    const session = await auth();

    const userRest = createUserRest(session?.user.access_token);
    const guilds = await userRest.get(Routes.userGuilds()) as RESTGetAPICurrentUserGuildsResult;

    if (!guilds) {
        return (
            <div className='flex justify-center items-center space-x-4 border-dashed border-4 border-neutral-800 rounded shadow-lg w-full h-20'>
                <ExclamationTriangleIcon className='size-6' />
                <span>Error loading guilds</span>
            </div>
        );
    };

    const ownedGuilds = guilds.filter(guild => guild.owner === true);

    if (ownedGuilds.length === 0) {
        return (
            <div className='flex justify-center items-center space-x-4 border-dashed border-4 border-neutral-800 rounded shadow-lg w-full h-20'>
                <ExclamationTriangleIcon className='size-6' />
                <span>You own no guilds</span>
            </div>
        );
    };

    return (
        <div className='w-full space-y-2'>
            {ownedGuilds?.map((guild) => (
                <Link href={`/manage/guilds/${guild.id}`} className='flex items-center justify-between gap-2 bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded shadow-lg w-full' key={guild.id}>
                    <div className='flex space-x-4 items-center'>
                        {guild.icon ? (
                            <Image src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={`${guild.name} Icon`} className='size-16 rounded' width={100} height={100} />
                        ) : (
                            <div className='size-16 flex items-center justify-center'>
                                <span className='text-4xl'>{guild.name.charAt(0)}</span>
                            </div>
                        )}
                        <span className='text-lg'>{guild.name}</span>
                    </div>
                </Link>
            ))}
        </div>
    );
};