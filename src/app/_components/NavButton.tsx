'use client';

import { Menu } from '@headlessui/react';
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from 'next/link';
import { NavLink } from '@/app/_components/Nav';

interface NavLinks {
    navLinks: Array<NavLink>;
}

export default function NavButton({ navLinks }: NavLinks) {
    return (
        <Menu as='div' className='relative md:hidden'>
            <Menu.Button className='flex items-center px-2 py-2 rounded hover:shadow-lg hover:bg-neutral-800 ui-open:bg-neutral-800 ui-open:shadow-lg'>
                <Bars3Icon className='h-8 w-8' />
            </Menu.Button>
            <Menu.Items className='absolute right-0 rounded mt-2 bg-neutral-800 min-w-full shadow-lg'>
                {navLinks.map((navLink, index) => (
                    <Menu.Item key={index}>
                        <Link href={navLink.href} className='flex items-center w-full px-4 py-2 ui-active:bg-neutral-700 rounded-t'>
                            {navLink.name}
                        </Link>
                    </Menu.Item>
                ))}
            </Menu.Items>
        </Menu>
    )
};