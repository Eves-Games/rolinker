'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { PlusIcon, KeyIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Guild } from '@prisma/client/edge';
import Image from 'next/image';
import ViewKeyDialog from './_components/ViewKeyDialog';
import CreateKeyDialog from './_components/CreateKeyDialog';

export const runtime = 'edge';

const fetcher = async (url: string) => fetch(url).then(async r => await r.json() as Guild[]);

export default function Page() {
    const { data: guilds, error, isLoading } = useSWR(
        `/api/authenticated/guilds?includeApiKeys=true`,
        fetcher
    );

    const [isOpen, setIsOpen] = useState(false);
    const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
    const [apiGuilds, setApiGuilds] = useState<Guild[]>([]);
    const [isGuildOpen, setIsGuildOpen] = useState({ open: false, guild: null as Guild | null });

    useEffect(() => {
        if (guilds) {
            setApiGuilds(guilds.filter(guild => guild.apiKey));
            setSelectedGuild(guilds.find(guild => !guild.apiKey) || null);
        }
    }, [guilds]);

    if (isLoading) {
        return (
            <div className='flex justify-center items-center border-dashed border-4 border-neutral-800 rounded shadow-lg w-full h-20'>
                <ArrowPathIcon className='size-6 animate-spin' />
            </div>
        );
    };

    if (error) {
        return (
            <div className='flex justify-center items-center space-x-4 border-dashed border-4 border-neutral-800 rounded shadow-lg w-full h-20'>
                <ExclamationTriangleIcon className='size-6' />
                <span>Error loading API keys</span>
            </div>
        );
    };

    if (guilds?.length == 0) {
        return (
            <div className='flex justify-center items-center space-x-4 border-dashed border-4 border-neutral-800 rounded shadow-lg w-full h-20'>
                <ExclamationTriangleIcon className='size-6' />
                <span>RoLinker bot is not a member of any of your guilds.</span>
            </div>
        );
    }

    return (
        <>
            <div className='w-full space-y-2'>
                {apiGuilds.map((guild) => (
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-2 bg-neutral-800 px-4 py-2 rounded shadow-lg w-full' key={guild.id}>
                        <div className='flex space-x-4 items-center'>
                            {guild.iconUrl ? (
                                <Image src={guild.iconUrl} alt={`${guild.name} Icon`} className='size-16 rounded' width={100} height={100} />
                            ) : (
                                <div className=' flex items-center justify-center'>
                                    <span className='text-4xl'>{guild.name.charAt(0)}</span>
                                </div>
                            )}
                            <span className='text-lg'>{guild.name}</span>
                        </div>
                        <div className='flex space-x-2 items-center justify-end'>
                            <span className='p-2'>Usage: {guild.apiKeyUsage}/750</span>
                            <button onClick={() => setIsGuildOpen({ open: true, guild: guild })} className='p-2 rounded-lg hover:bg-neutral-700'>
                                <KeyIcon className='size-6' />
                            </button>
                        </div>
                    </div>
                ))}
                {guilds?.filter(guild => !guild.apiKey).length != 0 && (
                    <button onClick={() => setIsOpen(true)} className='flex space-x-4 justify-center items-center border-dashed border-4 border-neutral-800 rounded shadow-lg hover:border-neutral-700 w-full h-20'>
                        <PlusIcon className='size-6' />
                        <span>Create API key</span>
                    </button>
                )}
            </div>

            <CreateKeyDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                guilds={guilds!}
                apiGuilds={apiGuilds}
                selectedGuild={selectedGuild}
                setSelectedGuild={setSelectedGuild}
            />
            <ViewKeyDialog isGuildOpen={isGuildOpen} setIsGuildOpen={setIsGuildOpen} />
        </>
    );
}