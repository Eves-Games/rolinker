"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { LinkHref } from "./Nav";
import { signOut } from "next-auth/react";

interface NavUserProps {
    userLinks: LinkHref[]
    name: string;
    image: string;
};

export default function ({ userLinks, name, image }: NavUserProps) {
    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost avatar">
                <h2 className='font-semibold'>{name}</h2>
                <div className="w-10 rounded-full">
                    <img alt="Avatar" src={image} />
                </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
                {userLinks.map(LinkHref => (
                    <li key={LinkHref.name}>
                        <Link href={LinkHref.href} className="justify-between">
                            {LinkHref.name}
                            {LinkHref.icon}
                        </Link>
                    </li>
                ))}
                <li>
                    <button onClick={() => signOut()} className="justify-between">
                        Log out
                        <LogOut className='size-5' />
                    </button>
                </li>
            </ul>
        </div>
    )
};