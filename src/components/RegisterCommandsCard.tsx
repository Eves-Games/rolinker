'use client';

import { CommandLineIcon } from "@heroicons/react/24/outline";

interface RegisterCommandsProps {
    registerCommands: () => Promise<void>;
}

export default function RegisterCommandsCard({registerCommands}: RegisterCommandsProps) {
    return (
        <button onClick={() => registerCommands()} className='bg-neutral-800 rounded shadow-lg flex items-center justify-between space-x-4 w-fit px-4 py-2 hover:bg-neutral-700'>
            <CommandLineIcon className="h-6" />
            <span>Register Commands</span>
        </button>
    );
};