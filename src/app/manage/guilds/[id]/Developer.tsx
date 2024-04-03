'use client';
import { useEffect, useState } from "react";
import { ArrowPathIcon, CodeBracketIcon, EyeIcon, EyeSlashIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { genDiscordRoles, regenerateApiKey } from "./actions";
import { Dialog } from "@headlessui/react";

export default function Developer({
    guildId,
    api
}: {
    guildId: string
    api: {
        apiKey: string | null
        apiKeyUsage: number
    },
}) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [showApiKey, setShowApiKey] = useState(false)
    const [resetTimer, setResetTimer] = useState('');
    const [apiKey, setApiKey] = useState(api.apiKey);

    const getTimeUntilReset = () => {
        const now = new Date();
        const resetTime = new Date(now);
        resetTime.setUTCHours(24, 0, 0, 0);
        const timeUntilReset = resetTime.getTime() - now.getTime();
        const hours = Math.floor(timeUntilReset / (1000 * 60 * 60));
        const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours.toString().padStart(2, '0')} hours and ${minutes.toString().padStart(2, '0')} minutes`;
    };

    useEffect(() => {
        setShowApiKey(false);
    }, [dialogOpen, apiKey]);

    useEffect(() => {
        const timer = setInterval(() => {
            setResetTimer(getTimeUntilReset());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const handleRegenerateApiKey = async () => {
        const newApiKey = await regenerateApiKey(guildId);
        setApiKey(newApiKey);
    };

    return (
        <>
            <div className='bg-neutral-800 rounded shadow-lg w-full'>
                <div className='flex items-center space-x-4 px-4 py-2'>
                    <CodeBracketIcon className='size-6' />
                    <span>Developer API</span>
                </div>
                <div className='space-y-2 py-2 px-4'>
                    <span>API Key</span>
                    <button onClick={() => setDialogOpen(true)} className='flex justify-between space-x-4 w-full bg-neutral-700 hover:bg-neutral-600 rounded-lg py-2 px-4 shadow-lg'>
                        <span className='truncate'>Edit API Key</span>
                        <PencilIcon className='size-6 flex-shrink-0' aria-hidden='true' />
                    </button>
                </div>
            </div>

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

                    <p>Usage resets in {resetTimer}</p>
                </div>
            </Dialog>
        </>
    );
}