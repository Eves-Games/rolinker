'use client';

import { Dialog } from "@headlessui/react";
import { ArrowPathIcon, EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { regenerateApiKey } from "../actions";

export default function EditKeyDialog({
    guildId,
    dialogOpen,
    setDialogOpen,
    api,
}: {
    guildId: string;
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    api: {
        apiKey: string | null;
        apiKeyUsage: number
    };
}) {
    const [showApiKey, setShowApiKey] = useState(false)
    const [apiKey, setApiKey] = useState(api.apiKey);

    useEffect(() => {
        setShowApiKey(false);
    }, [dialogOpen, apiKey]);

    const handleRegenerateApiKey = async () => {
        const newApiKey = await regenerateApiKey(guildId);
        if (newApiKey) setApiKey(newApiKey);
    };

    return (
        <Dialog open={dialogOpen} onClose={setDialogOpen} className='fixed inset-0 flex items-center justify-center z-50 px-4'>
                <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
                <div className='space-y-4 relative bg-neutral-800 rounded-lg px-6 py-4 shadow-lg'>
                    <div className='flex space-x-4 justify-between items-center'>
                        <Dialog.Title className='text-2xl font-bold'>Edit API Key</Dialog.Title>
                        <button onClick={() => setDialogOpen(false)} className='p-2 text-gray-400 hover:text-gray-200'>
                            <XMarkIcon className='size-6' />
                        </button>
                    </div>

                    <div className='space-y-2'>
                        <div className='flex items-center space-x-2'>
                            <div className={`border-dashed border-2 border-neutral-700 px-4 py-2 rounded-lg`}>
                                <span className={`${!showApiKey && 'blur select-none'} break-all`}>{apiKey}</span>
                            </div>
                            <button className='p-2 rounded-lg hover:bg-neutral-700' onClick={() => setShowApiKey(!showApiKey)}>
                                {showApiKey ? (
                                    <EyeSlashIcon className='size-6' />
                                ) : (
                                    <EyeIcon className='size-6' />
                                )}
                            </button>
                        </div>
                        <p className='text-sm text-yellow-500'>Do not share your API key publicly. Keep it secure.</p>
                    </div>

                    <form action={handleRegenerateApiKey}>
                        <button className='flex justify-between space-x-4 bg-neutral-700 hover:bg-neutral-600 rounded-lg py-2 px-4 shadow-lg'>
                            <span className='truncate'>Reset API Key</span>
                            <ArrowPathIcon className='size-6 flex-shrink-0' aria-hidden='true' />
                        </button>
                    </form>
                </div>
            </Dialog>
    );
}