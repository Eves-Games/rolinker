"use client"

import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Link from 'next/link';
import { RoLinkerLogo } from './RoLinkerLogo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, Settings, Sliders } from 'lucide-react';

export interface NavLink {
    name: string;
    href: string;
};

const NavLinks = [
    { name: 'Commands', href: '/commands' },
    { name: 'Documentation', href: 'https://docs.rolinker.net' },
    { name: 'Discord', href: 'https://discord.gg/CJDuGzwFX4' },
] satisfies Array<NavLink>;

export default function () {
    const session = useSession()

    return (
        <NavigationMenu className='mx-auto my-2'>
            <NavigationMenuList>
                <Button variant="ghost" asChild>
                    <Link href='/'>
                        <RoLinkerLogo className='size-6' />
                        <h1 className='font-black text-xl ml-2'>RoLinker</h1>
                    </Link>
                </Button>
                {NavLinks.map((navLink, index) => (
                    <NavigationMenuItem key={index}>
                        <Button variant="ghost" asChild>
                            <Link href={navLink.href}>{navLink.name}</Link>
                        </Button>
                    </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                                <div className='flex items-center'>
                                    <h2 className='font-semibold mr-2'>{session.data?.user.name}</h2>
                                    <Avatar className='size-8'>
                                        <AvatarImage src={session.data?.user.image} />
                                        <AvatarFallback>{session.data?.user.name}</AvatarFallback>
                                    </Avatar>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='bg-neutral-800 border-neutral-700'>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator className='bg-neutral-700' />
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link href='/manage/accounts'>
                                        <Sliders className="mr-2 h-4 w-4" />
                                        <span>Manage</span>
                                        <DropdownMenuShortcut className='ml-2'>⌘M</DropdownMenuShortcut>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href='/settings/account'>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                        <DropdownMenuShortcut className='ml-2'>⌘S</DropdownMenuShortcut>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <button onClick={() => signOut()}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Logout</span>
                                        <DropdownMenuShortcut className='ml-2'>⌘L</DropdownMenuShortcut>
                                    </button>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}