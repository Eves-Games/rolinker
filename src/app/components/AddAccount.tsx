'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { signIn } from "next-auth/react";

export default function AddAccountCard() {
    return (
        <button onClick={() => signIn("roblox")} className="px-4 py-2 w-full flex justify-center items-center transition hover:bg-neutral-700 bg-neutral-800 rounded shadow-lg">
            <PlusIcon className="h-16 w-6" />
        </button>
    )
}