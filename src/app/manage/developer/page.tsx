'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { TrashIcon, PlusIcon, KeyIcon, PresentationChartLineIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { Dialog, Listbox } from '@headlessui/react';

export const runtime = 'edge';

export default function Page() {
    /**const code = (
        {accounts.map((account) => (
            <div className='grid grid-cols-2 lg:grid-cols-3 gap-2 items-center bg-neutral-800 px-4 py-2 rounded shadow-lg' key={account.id}>
                <div className='flex items-center space-x-4'>
                    <Image src={account.imageUrl} alt='Guild Icon' className='size-16 rounded' width={100} height={100} />
                    <span className='text-lg'>{account.name}</span>
                </div>
                <span className='p-2 text-center'>Usage: 0/750</span>
                <div className='flex space-x-2 justify-start md:justify-end items-center'>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                    }}>
                        <button className='flex space-x-2 p-2 rounded hover:bg-neutral-700'>
                            <PresentationChartLineIcon className='size-6' />
                            <span>Upgrade</span>
                        </button>
                    </form>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                    }}>
                        <button className='flex space-x-2 p-2 rounded hover:bg-neutral-700'>
                            <KeyIcon className='size-6' />
                            <span>View Key</span>
                        </button>
                    </form>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        setAccounts((prevAccounts) => prevAccounts.filter((accountEntry) => accountEntry.id !== account.id));
                    }}>
                        <button className='p2 rounded hover:bg-neutral-700'>
                            <TrashIcon className='size-6 stroke-red-500' />
                        </button>
                    </form>
                </div>
            </div>
        ))}
    )*/

    const guilds = [
        {
            name: 'Guild 1',
            id: '1'
        },
        {
            name: 'Guild 2',
            id: '2'
        },
        {
            name: 'Guild 3',
            id: '3'
        },
    ]

    const [isOpen, setIsOpen] = useState(false)
    const [selectedGuild, setSelectedGuild] = useState(guilds[0])

    return (
        <>
            <div className='w-full space-y-2'>
                <button onClick={() => setIsOpen(true)} className='flex space-x-4 px-4 py-2 justify-center items-center border-dashed border-4 border-neutral-800 rounded shadow-lg hover:border-neutral-700 w-full h-20'>
                    <PlusIcon className='size-6' />
                    <span>Create API Key</span>
                </button>
            </div>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className='fixed inset-0 flex items-center justify-center z-50 px-4'>
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <div className="space-y-4 relative bg-neutral-800 rounded-lg max-w-lg w-fit mx-auto px-6 py-4">
                    <Dialog.Title className='text-2xl font-bold mb-4'>Create API Key</Dialog.Title>

                    <Dialog.Description>
                        This will create an API key for the selected Discord guild.
                    </Dialog.Description>

                    <div className='space-y-2 relative'>
                        <span>Discord Servers</span>
                        <Listbox value={selectedGuild} onChange={setSelectedGuild}>
                            <Listbox.Button className='w-full flex justify-between rounded-lg bg-neutral-700 hover:bg-neutral-600 py-2 px-4 shadow-lg'>
                                <span className='truncate'>{selectedGuild.name} ({selectedGuild.id})</span>
                                <ChevronUpDownIcon className='size-6' aria-hidden='true' />
                            </Listbox.Button>
                            <Listbox.Options className='absolute mt-2 max-h-60 w-full overflow-auto rounded-md bg-neutral-700 shadow-lg'>
                                {guilds.map((guild, index) => (
                                    <Listbox.Option as='button' key={index} className='flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-600' value={guild}>
                                        {({ selected }) => (
                                            <>
                                                <span className='block truncate'>{guild.name} ({guild.id})</span>
                                                {selected && <CheckIcon className='size-6' aria-hidden='true' />}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Listbox>
                    </div>

                    <p className='text-sm'>Please note that there is a daily limit of 750 uses for the API key. If you require more, you can upgrade after key creation.</p>
                    <p className='text-sm'>Refer to our <a href="/fair-use-policy" className='text-blue-400 hover:underline'>Fair Use Policy</a> for more information.</p>

                    <button className={`bg-green-700 py-2 px-4 rounded-lg hover:bg-green-600`} onClick={() => setIsOpen(false)}>
                        Create Key
                    </button>
                </div>
            </Dialog>
        </>

    );
}