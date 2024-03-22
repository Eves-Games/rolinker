'use client';

import useSWR, { mutate } from 'swr';
import { useEffect, useState } from 'react';
import { PlusIcon, CheckIcon, ChevronUpDownIcon, XMarkIcon, KeyIcon, EyeIcon, ArrowPathIcon, EyeSlashIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Dialog, Listbox } from '@headlessui/react';
import { Guild } from '@prisma/client/edge';
import Image from 'next/image';
import { disableApiKey, enableApiKey } from './actions';

interface GuildWithApiKey extends Guild {
    apiKey?: {
        id: string;
        userId: string;
        usage: number;
        key: string;
        guildId: string;
        createdAt: Date;
    }
}

export const runtime = 'edge';

const fetcher = async (url: string) => fetch(url).then(async r => await r.json() as GuildWithApiKey[]);

export default function Page() {
    const { data: guilds, error, isLoading } = useSWR(
        `/api/users/authenticated/guilds?includeApiKeys=true`,
        fetcher
    );

    const [isOpen, setIsOpen] = useState(false);
    const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
    const [apiGuilds, setApiGuilds] = useState<GuildWithApiKey[]>([]);
    const [isGuildOpen, setIsGuildOpen] = useState({ open: false, guild: null as GuildWithApiKey | null });
    const [showApiKey, setShowApiKey] = useState(false);
    const [resetTimer, setResetTimer] = useState('');

    const getTimeUntilReset = () => {
        const now = new Date();
        const resetTime = new Date(now);
        resetTime.setUTCHours(24, 0, 0, 0);
        const timeUntilReset = resetTime.getTime() - now.getTime();
        const hours = Math.floor(timeUntilReset / (1000 * 60 * 60));
        const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours.toString().padStart(2, '0')} hours and ${minutes.toString().padStart(2, '0')} minutes`;
    };

    useEffect(() => {
        if (guilds) {
            setApiGuilds(guilds.filter(guild => guild.apiKey && guild.apiKey.key && guild.apiKey.key.length > 0));
            setSelectedGuild(guilds.find(guild => !guild.apiKey) || null);
        }
    }, [guilds]);

    useEffect(() => {
        const timer = setInterval(() => {
            setResetTimer(getTimeUntilReset());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

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
                            <span className='p-2'>Usage: {guild.apiKey?.usage || 0}/750</span>
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

            {/* Create API Key Dialog */}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className='fixed inset-0 flex items-center justify-center z-50 px-4'>
                <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
                <div className='space-y-4 relative bg-neutral-800 rounded-lg max-w-lg w-fit mx-auto px-6 py-4'>
                    <div className='flex space-x-4 justify-between items-center'>
                        <Dialog.Title className='text-2xl font-bold'>Create API Key</Dialog.Title>
                        <button onClick={() => setIsOpen(false)} className='p-2 text-gray-400 hover:text-gray-200'>
                            <XMarkIcon className='size-6' />
                        </button>
                    </div>

                    <Dialog.Description>
                        This will create an API key for the selected Discord guild.
                    </Dialog.Description>

                    <div className='space-y-2 relative'>
                        <span>Discord Servers</span>
                        <Listbox value={selectedGuild} onChange={setSelectedGuild}>
                            <Listbox.Button className='w-full flex justify-between rounded-lg bg-neutral-700 hover:bg-neutral-600 py-2 px-4 shadow-lg'>
                                <span className='truncate'>{selectedGuild?.name}</span>
                                <ChevronUpDownIcon className='size-6' aria-hidden='true' />
                            </Listbox.Button>
                            <Listbox.Options className='absolute mt-2 max-h-60 w-full overflow-auto rounded-lg bg-neutral-700 shadow-lg'>
                                {guilds!.filter(guild => !apiGuilds.some(apiGuild => apiGuild.id === guild.id)).map((guild, index) => (
                                    <Listbox.Option as='button' key={index} className='flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-600' value={guild}>
                                        {({ selected }) => (
                                            <>
                                                <span className='block truncate'>{guild.name}</span>
                                                {selected && <CheckIcon className='size-6' aria-hidden='true' />}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Listbox>
                    </div>

                    <p className='text-sm'>Please note that there is a daily limit of 750 uses for the API key. If you require more, you can upgrade after key creation.</p>
                    <p className='text-sm'>Refer to our <a href='/fair-use-policy' className='text-blue-400 hover:underline'>Fair Use Policy</a> for more information.</p>

                    <form onSubmit={async () => {
                        setIsOpen(false)
                        await enableApiKey(selectedGuild!.id);
                        mutate(`/api/users/authenticated/guilds?includeApiKeys=true`);
                    }}>
                        <button className={`bg-green-700 py-2 px-4 rounded-lg hover:bg-green-600`}>
                            Create Key
                        </button>
                    </form>

                </div>
            </Dialog>

            {/* View Key Dialog */}
            <Dialog open={isGuildOpen.open} onClose={() => setIsGuildOpen({ open: false, guild: null })} className='fixed inset-0 flex items-center justify-center z-50 px-4'>
                <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
                <div className='space-y-4 relative bg-neutral-800 rounded-lg px-6 py-4'>
                    <div className='flex space-x-4 justify-between items-center'>
                        <Dialog.Title className='text-2xl font-bold'>{isGuildOpen.guild?.name || 'Guild'}&#39;s API key</Dialog.Title>
                        <button onClick={() => setIsGuildOpen({ open: false, guild: null })} className='p-2 text-gray-400 hover:text-gray-200'>
                            <XMarkIcon className='size-6' />
                        </button>
                    </div>

                    <div className='space-y-2'>
                        <div className='flex items-center space-x-2'>
                            <div className={`border-dashed border-2 border-neutral-700 px-4 py-2 rounded-lg`}>
                                <span className={`${!showApiKey && 'blur select-none'} break-all`}>{isGuildOpen.guild?.apiKey?.key}</span>
                            </div>
                            <button className='p-2 rounded-lg hover:bg-neutral-700' onClick={() => setShowApiKey(!showApiKey)}>
                                {showApiKey ? (
                                    <EyeSlashIcon className='size-6' />
                                ) : (
                                    <EyeIcon className='size-6' />
                                )}
                            </button>
                        </div>
                        <p className='text-sm text-yellow-500'>Do not share your API key publicly. Keep it secure.</p>
                    </div>

                    <div className='flex justify-between items-center'>
                        <span>Usage resets in {resetTimer}</span>
                        <form action={async () => {
                            setIsGuildOpen({ open: false, guild: null })
                            await disableApiKey(isGuildOpen.guild!.id);
                            mutate(`/api/users/authenticated/guilds?includeApiKeys=true`);
                        }}>
                            <button className='p-2 rounded-lg hover:bg-neutral-700'>
                                <TrashIcon className='size-6 stroke-red-500' />
                            </button>
                        </form>
                    </div>
                </div>
            </Dialog>
        </>
    );
}