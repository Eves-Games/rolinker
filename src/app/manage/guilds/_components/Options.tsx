'use client';

import { updateGuildGroup } from '@/lib/guilds';
import { Disclosure, Listbox } from '@headlessui/react';
import { UserGroupIcon, PlusIcon, MinusIcon, CheckIcon, ChevronUpDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { GroupBasicResponse } from 'roblox-api-types';

interface OptionsProps {
    id: string;
    currentGroupId: number | null;
    groups: GroupBasicResponse[];
}

export const Options: React.FC<OptionsProps> = ({ id, currentGroupId, groups }) => {
    const [selectedGroup, setSelectedGroup] = useState(groups.find(group => group.id == currentGroupId) || groups[0]);
    const [initialGroup, setInitialGroup] = useState(selectedGroup);
    const [canSubmit, setCanSubmit] = useState(false);

    useEffect(() => {
        setCanSubmit(selectedGroup.id !== initialGroup.id);
    }, [selectedGroup, initialGroup]);

    return (
        <>
            <Disclosure>
                {({ open }) => (
                    <div className='rounded bg-neutral-800 shadow-lg'>
                        <Disclosure.Button className='flex items-center justify-between space-x-4 w-full px-4 py-2 hover:bg-neutral-700 rounded'>
                            <div className='flex items-center space-x-4'>
                                <UserGroupIcon className='h-6 w-6' />
                                <span className='text-lg'>Group Options</span>
                            </div>
                            {open ? <MinusIcon className='h-6 w-6' /> : <PlusIcon className='h-6 w-6' />}
                        </Disclosure.Button>
                        <Disclosure.Panel className='gap-4 grid grid-cols-1 md:grid-cols-3 py-2 px-4'>
                            <div className='space-y-2'>
                                <span className='text-lg'>Discord Roles</span>
                                <button className='flex justify-between w-full bg-neutral-700 hover:bg-neutral-600 rounded-lg py-2 px-4 shadow-lg'>
                                    Generate Discord Roles
                                    <ArrowPathIcon className='h-6' aria-hidden='true' />
                                </button>
                            </div>
                            <div className='col-span-2 space-y-2 relative'>
                                <span className='text-lg'>Roblox Group</span>
                                <Listbox value={selectedGroup} onChange={setSelectedGroup}>
                                    <Listbox.Button className='w-full flex justify-between rounded-lg bg-neutral-700 py-2 px-4 shadow-lg'>
                                        <span className='block truncate'>{selectedGroup.name} ({selectedGroup.id})</span>
                                        <ChevronUpDownIcon className='h-6' aria-hidden='true' />
                                    </Listbox.Button>
                                    <Listbox.Options className='absolute mt-2 max-h-60 w-full overflow-auto rounded-md bg-neutral-700 shadow-lg'>
                                        {groups.map((group, index) => (
                                            <Listbox.Option
                                                as='button'
                                                key={index}
                                                className='flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-600'
                                                value={group}
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span className='block truncate'>{group.name} ({group.id})</span>
                                                        {selected && <CheckIcon className='h-6' aria-hidden='true' />}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Listbox>
                            </div>
                        </Disclosure.Panel>
                    </div>
                )}
            </Disclosure>
            <form onSubmit={async (e) => {
                e.preventDefault();
                setInitialGroup(selectedGroup);
                await updateGuildGroup(id, selectedGroup.id.toString());
            }}>
                <button
                    className={`bg-green-700 font-bold py-2 px-4 rounded ${canSubmit ? 'hover:bg-green-600' : 'opacity-50 cursor-not-allowed'}`}
                    disabled={!canSubmit}
                >
                    Save Changes
                </button>
            </form>
        </>
    );
};