'use client';

import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { APIGuild } from "../page";

export default function ParentList({
    guilds,
    selectedParent,
    onChange,
}: {
    guilds: APIGuild[];
    selectedParent: APIGuild | null;
    onChange: (parent: APIGuild | null) => void;
}) {
    return (
        <Listbox value={selectedParent} onChange={onChange}>
            <Listbox.Button className='space-x-4 w-full justify-between flex rounded-lg bg-neutral-700 hover:bg-neutral-600 py-2 px-4 shadow-lg'>
                <span className='truncate'>{selectedParent?.name || 'None'}</span>
                <ChevronUpDownIcon className='size-6 flex-shrink-0' aria-hidden='true' />
            </Listbox.Button>
            <Listbox.Options className='absolute w-full mt-2 max-h-60 overflow-auto rounded-md bg-neutral-700 shadow-lg z-50'>
                <Listbox.Option as='button' key='none' className='flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-600 rounded-lg' value={null}>
                    <span className='block truncate'>None</span>
                    {selectedParent === null && <CheckIcon className='size-6 flex-shrink-0' aria-hidden='true' />}
                </Listbox.Option>
                {guilds.map((guild, index) => (
                    <Listbox.Option as='button' key={index} className='flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-600 rounded-lg' value={guild}>
                        <span className='block truncate'>{guild.name}</span>
                        {guild.id === selectedParent?.id && <CheckIcon className='size-6 flex-shrink-0' aria-hidden='true' />}
                    </Listbox.Option>
                ))}
            </Listbox.Options>
        </Listbox>
    );
}