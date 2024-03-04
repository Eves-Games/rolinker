'use client';

import { Disclosure } from "@headlessui/react";
import { UserGroupIcon, PlusIcon, MinusIcon, HashtagIcon, FlagIcon } from "@heroicons/react/24/outline";

export default function GuildOptions() {
    return (
        <>
            <Disclosure>
                {({ open }) => (
                    <>
                        <Disclosure.Button className="flex items-center justify-between space-x-4 bg-neutral-800 w-full px-4 py-2 rounded shadow-lg">
                            <div className='flex items-center space-x-4'>
                                <UserGroupIcon className='h-6 w-6' />
                                <span className='text-lg'>Group Options</span>
                            </div>
                            {open ? (
                                <MinusIcon className='h-6 w-6' />
                            ) : (
                                <PlusIcon className='h-6 w-6' />
                            )}
                        </Disclosure.Button>
                        <Disclosure.Panel>
                            Group Options
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            <Disclosure>
                {({ open }) => (
                    <>
                        <Disclosure.Button className="flex items-center justify-between space-x-4 bg-neutral-800 w-full px-4 py-2 rounded shadow-lg">
                            <div className='flex items-center space-x-4'>
                                <FlagIcon className='h-6 w-6' />
                                <span className='text-lg'>Affiliation Options</span>
                            </div>
                            {open ? (
                                <MinusIcon className='h-6 w-6' />
                            ) : (
                                <PlusIcon className='h-6 w-6' />
                            )}
                        </Disclosure.Button>
                        <Disclosure.Panel>
                            Affiliation Options
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            <Disclosure>
                {({ open }) => (
                    <>
                        <Disclosure.Button className="flex items-center justify-between space-x-4 bg-neutral-800 w-full px-4 py-2 rounded shadow-lg">
                            <div className='flex items-center space-x-4'>
                                <HashtagIcon className='h-6 w-6' />
                                <span className='text-lg'>Invite Channel Options</span>
                            </div>
                            {open ? (
                                <MinusIcon className='h-6 w-6' />
                            ) : (
                                <PlusIcon className='h-6 w-6' />
                            )}
                        </Disclosure.Button>
                        <Disclosure.Panel>
                            Invite Channel Options
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </>
    );
}