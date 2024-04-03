'use client';

import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { APITextChannel } from "discord-api-types/v10";

export default function ChannelList({
    channels,
    selectedChannel,
    onChange,
}: {
    channels: APITextChannel[];
    selectedChannel: APITextChannel | null;
    onChange: (channel: APITextChannel | null) => void;
}) {
    return (
        <Listbox value={selectedChannel} onChange={onChange}>
            <Listbox.Button className='space-x-4 w-full justify-between flex rounded-lg bg-neutral-700 hover:bg-neutral-600 py-2 px-4 shadow-lg'>
                <span className='truncate'>{selectedChannel?.name || 'None'}</span>
                <ChevronUpDownIcon className='size-6 flex-shrink-0' aria-hidden='true' />
            </Listbox.Button>
            <Listbox.Options className='absolute w-full mt-2 max-h-60 overflow-auto rounded-md bg-neutral-700 shadow-lg z-50'>
                <Listbox.Option as='button' key='none' className='flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-600 rounded-lg' value={null}>
                    <span className='block truncate'>None</span>
                    {selectedChannel === null && <CheckIcon className='size-6 flex-shrink-0' aria-hidden='true' />}
                </Listbox.Option>
                {channels.map((channel, index) => (
                    <Listbox.Option as='button' key={index} className='flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-600 rounded-lg' value={channel}>
                        <span className='block truncate'>{channel.name}</span>
                        {channel.id === selectedChannel?.id && <CheckIcon className='size-6 flex-shrink-0' aria-hidden='true' />}
                    </Listbox.Option>
                ))}
            </Listbox.Options>
        </Listbox>
    );
}