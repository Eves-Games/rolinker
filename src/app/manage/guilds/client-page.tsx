'use client';

import { useEffect, useState } from 'react';
import { PlusIcon, ArrowPathIcon, PencilIcon, ChevronUpDownIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Guild } from '@prisma/client/edge';
import Image from 'next/image';
import Link from 'next/link';
import { GroupBasicResponse } from 'roblox-api-types';
import { Dialog, Listbox } from '@headlessui/react';
import { genDiscordRoles } from './actions';
import { updateGuildGroup, updateGuildParent } from '@/lib/guilds';

export const runtime = 'edge';

interface GuildWithParent extends Guild {
    parentGuild?: Guild;
};

export default function ClientPage({ guilds, groups }: { guilds: GuildWithParent[], groups: GroupBasicResponse[] }) {
    const [guildDialog, setGuildDialog] = useState<{ isOpen: boolean, guild?: Guild | null, group?: GroupBasicResponse | null, parentGuild?: Guild | null }>({ isOpen: false, guild: null, group: null, parentGuild: null });
    const [canSubmit, setCanSubmit] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<GroupBasicResponse | null>(null);
    const [selectedParent, setSelectedParent] = useState<GuildWithParent | null>(null);

    useEffect(() => {
        setSelectedGroup(guildDialog.group || null);
        setSelectedParent(guildDialog.parentGuild || null)
        const guild = guilds?.find(guild => guild === guildDialog.guild);
        const parent = guilds?.find(guild => guild === guildDialog.parentGuild);
        if (guild) {
            guild.groupId = guildDialog.group?.id?.toString() || null;

            if (parent) {
                guild.parentGuild = parent;
            }
        }
    }, [guildDialog]);

    useEffect(() => {
        setCanSubmit(
            (selectedGroup !== guildDialog.group) ||
            (selectedParent !== guildDialog.parentGuild)
          );
    }, [selectedGroup, guildDialog.group, selectedParent, guildDialog.parentGuild]);

    if (guilds?.length == 0) {
        return (
            <Link className='flex space-x-4 px-4 py-2 justify-center items-center border-dashed border-4 border-neutral-800 rounded shadow-lg hover:border-neutral-700 h-20' href='https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id=990855457885278208&permissions=8&disable_guild_select=true&redirect_uri=https://rolinker.net/api/auth/guild&response_type=code'>
                <PlusIcon className='size-6' />
                <span>Add Guild</span>
            </Link>
        );
    };

    return (
        <>
            <div className='w-full space-y-2'>
                {guilds?.map((guild) => (
                    <div className='flex items-center justify-between gap-2 bg-neutral-800 px-4 py-2 rounded shadow-lg w-full' key={guild.id}>
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
                        <button onClick={() => {
                            setGuildDialog({ isOpen: true, guild: guild, group: groups?.find(group => group.id.toString() === guild.groupId), parentGuild: guild.parentGuild });
                        }} className='p-2 rounded-lg hover:bg-neutral-700'>
                            <PencilIcon className='size-6' />
                        </button>
                    </div>
                ))}
                <Link className='flex space-x-4 px-4 py-2 justify-center items-center border-dashed border-4 border-neutral-800 rounded shadow-lg hover:border-neutral-700 h-20' href='https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id=990855457885278208&permissions=8&disable_guild_select=true&redirect_uri=https://rolinker.net/api/auth/guild&response_type=code'>
                    <PlusIcon className='size-6' />
                    <span>Add Guild</span>
                </Link>
            </div>

            <Dialog open={guildDialog.isOpen} onClose={() => setGuildDialog({ isOpen: false })} className='fixed inset-0 flex items-center justify-center z-50 px-4'>
                <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
                <div className='space-y-4 relative bg-neutral-800 rounded-lg px-6 py-4 shadow-lg w-md'>
                    <div className='flex space-x-4 justify-between items-center'>
                        <Dialog.Title className='text-2xl font-bold'>{guildDialog.guild?.name || 'Guild'}</Dialog.Title>
                        <button onClick={() => setGuildDialog({ isOpen: false })} className='p-2 text-gray-400 hover:text-gray-200'>
                            <XMarkIcon className='size-6' />
                        </button>
                    </div>

                    <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
                        <div className='space-y-2'>
                            <h2>Discord Roles</h2>
                            <form action={() => { genDiscordRoles(guildDialog.guild!.id); }}>
                                <button className='space-x-4 w-full flex justify-between bg-neutral-700 hover:bg-neutral-600 rounded-lg py-2 px-4 shadow-lg'>
                                    <span className='truncate'>Generate Discord Roles</span>
                                    <ArrowPathIcon className='size-6 inline-block' aria-hidden='true' />
                                </button>
                            </form>
                        </div>

                        <div className='space-y-2 relative'>
                            <h2>Roblox Group</h2>
                            <Listbox value={guildDialog.group} onChange={setSelectedGroup}>
                                <Listbox.Button className='space-x-4 w-full flex justify-between rounded-lg bg-neutral-700 hover:bg-neutral-600 py-2 px-4 shadow-lg'>
                                    <span className='truncate'>{selectedGroup?.name || 'None'}</span>
                                    <ChevronUpDownIcon className='size-6 inline-block' aria-hidden='true' />
                                </Listbox.Button>
                                <Listbox.Options className='absolute w-full mt-2 max-h-60 overflow-auto rounded-md bg-neutral-700 shadow-lg z-50'>
                                    <Listbox.Option as='button' key='none' className='flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-600 rounded-lg' value={null}>
                                        <span className='block truncate'>None</span>
                                        {selectedGroup === null && <CheckIcon className='size-6' aria-hidden='true' />}
                                    </Listbox.Option>
                                    {groups?.map((group, index) => (
                                        <Listbox.Option as='button' key={index} className='flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-600 rounded-lg' value={group}>
                                            <span className='block truncate'>{group.name}</span>
                                            {group === selectedGroup && <CheckIcon className='size-6' aria-hidden='true' />}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Listbox>
                        </div>
                    </div>

                    <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
                        <div className='space-y-2 relative'>
                            <h2>Parent Guild</h2>
                            <Listbox value={guildDialog.parentGuild} onChange={setSelectedParent}>
                                <Listbox.Button className='space-x-4 w-full justify-between flex rounded-lg bg-neutral-700 hover:bg-neutral-600 py-2 px-4 shadow-lg'>
                                    <span className='truncate'>{selectedParent?.name || 'None'}</span>
                                    <ChevronUpDownIcon className='size-6 inline-block' aria-hidden='true' />
                                </Listbox.Button>
                                <Listbox.Options className='absolute w-full mt-2 max-h-60 overflow-auto rounded-md bg-neutral-700 shadow-lg z-50'>
                                    <Listbox.Option as='button' key='none' className='flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-600 rounded-lg' value={null}>
                                        <span className='block truncate'>None</span>
                                        {selectedParent === null && <CheckIcon className='size-6' aria-hidden='true' />}
                                    </Listbox.Option>
                                    {guilds?.map((guild, index) => (
                                        <Listbox.Option as='button' key={index} className='flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-600 rounded-lg' value={guild}>
                                            <span className='block truncate'>{guild.name}</span>
                                            {guild === selectedParent && <CheckIcon className='size-6' aria-hidden='true' />}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Listbox>
                        </div>
                    </div>

                    <form action={() => {
                        updateGuildGroup(guildDialog.guild!.id, selectedGroup?.id ? selectedGroup.id.toString() : null);
                        updateGuildParent(guildDialog.guild!.id, selectedParent?.id || null);
                        setGuildDialog({ isOpen: true, guild: guildDialog.guild, group: selectedGroup, parentGuild: selectedParent })
                    }}>
                        <button className={`bg-green-700 py-2 px-4 rounded-lg ${canSubmit ? 'hover:bg-green-600' : 'opacity-50 cursor-not-allowed'}`} disabled={!canSubmit}>Save Changes</button>
                    </form>
                </div>
            </Dialog>
        </>
    );
};