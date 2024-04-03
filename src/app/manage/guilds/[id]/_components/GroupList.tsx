'use client';

import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { GroupBasicResponse } from "roblox-api-types";

export default function GroupList({
    groups,
    selectedGroup,
    onChange,
}: {
    groups: GroupBasicResponse[];
    selectedGroup: GroupBasicResponse | null;
    onChange: (group: GroupBasicResponse | null) => void;
}) {
    return (
        <Listbox value={selectedGroup} onChange={onChange}>
            <Listbox.Button className='space-x-4 w-full flex justify-between rounded-lg bg-neutral-700 hover:bg-neutral-600 py-2 px-4 shadow-lg'>
                <span className='truncate'>{selectedGroup?.name || 'None'}</span>
                <ChevronUpDownIcon className='size-6 flex-shrink-0' aria-hidden='true' />
            </Listbox.Button>
            <Listbox.Options className='absolute w-full mt-2 max-h-60 overflow-auto rounded-md bg-neutral-700 shadow-lg z-50'>
                <Listbox.Option as='button' key='none' className='flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-600 rounded-lg' value={null}>
                    <span className='block truncate'>None</span>
                    {selectedGroup === null && <CheckIcon className='size-6 flex-shrink-0' aria-hidden='true' />}
                </Listbox.Option>
                {groups.map((group, index) => (
                    <Listbox.Option as='button' key={index} className='flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-600 rounded-lg' value={group}>
                        <span className='block truncate'>{group.name}</span>
                        {group.id === selectedGroup?.id && <CheckIcon className='size-6 flex-shrink-0' aria-hidden='true' />}
                    </Listbox.Option>
                ))}
            </Listbox.Options>
        </Listbox>
    );
}