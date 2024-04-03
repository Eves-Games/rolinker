'use client';

import { Menu } from '@headlessui/react';
import Image from 'next/image';
import { Cog6ToothIcon, AdjustmentsHorizontalIcon, ArrowLeftEndOnRectangleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface Props {
    name: string;
    image: string;
};

export default function UserCard({ name, image }: Props) {
    return (
        <Menu as='div' className='relative'>
            <Menu.Button className='flex items-center gap-4 px-4 py-2 rounded hover:shadow-lg hover:bg-neutral-800 ui-open:bg-neutral-800 ui-open:shadow-lg'>
                <ChevronDownIcon className='size-6 inline-block text-gray-400' />
                <span className='font-semibold'>{name}</span>
                <Image src={image || ''} width={32} height={32} alt='Profile Icon' className='h-8 w-8 rounded-full' />
            </Menu.Button>
            <Menu.Items className='absolute right-0 rounded mt-2 bg-neutral-800 min-w-full shadow-lg'>
                <Menu.Item>
                    <Link href='/manage/accounts' className='flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-700 rounded'>
                        <span>Manage</span>
                        <AdjustmentsHorizontalIcon className='h-6' />
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <button onClick={() => signOut()} className='flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-700 rounded'>
                        Logout
                        <ArrowLeftEndOnRectangleIcon className='h-6' />
                    </button>
                </Menu.Item>
            </Menu.Items>
        </Menu>
    );
};