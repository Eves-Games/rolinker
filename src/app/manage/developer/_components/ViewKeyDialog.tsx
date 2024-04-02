import { Dialog } from "@headlessui/react";
import { disableApiKey } from "../actions";
import { mutate } from "swr";
import { EyeIcon, EyeSlashIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Guild } from "@prisma/client/edge";

interface ViewKeyDialogProps {
    isGuildOpen: {
        open: boolean;
        guild: Guild | null;
    };
    setIsGuildOpen: (state: { open: boolean; guild: Guild | null }) => void;
}

export default function ViewKeyDialog({ isGuildOpen, setIsGuildOpen }: ViewKeyDialogProps) {
    const [showApiKey, setShowApiKey] = useState(false);
    const [resetTimer, setResetTimer] = useState('');

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
    }, [isGuildOpen.open]);

    useEffect(() => {
        const timer = setInterval(() => {
            setResetTimer(getTimeUntilReset());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Dialog open={isGuildOpen.open} onClose={() => setIsGuildOpen({ open: false, guild: null })} className='fixed inset-0 flex items-center justify-center z-50 px-4'>
            <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
            <div className='space-y-4 relative bg-neutral-800 rounded-lg px-6 py-4 shadow-lg'>
                <div className='flex space-x-4 justify-between items-center'>
                    <Dialog.Title className='text-2xl font-bold'>{isGuildOpen.guild?.name || 'Guild'}&#39;s API key</Dialog.Title>
                    <button onClick={() => setIsGuildOpen({ open: false, guild: null })} className='p-2 text-gray-400 hover:text-gray-200'>
                        <XMarkIcon className='size-6' />
                    </button>
                </div>

                <div className='space-y-2'>
                    <div className='flex items-center space-x-2'>
                        <div className={`border-dashed border-2 border-neutral-700 px-4 py-2 rounded-lg`}>
                            <span className={`${!showApiKey && 'blur select-none'} break-all`}>{isGuildOpen.guild?.apiKey}</span>
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

                <div className='flex justify-between items-center'>
                    <span>Usage resets in {resetTimer}</span>
                    <form onSubmit={async () => {
                        setIsGuildOpen({ open: false, guild: null });
                        await disableApiKey(isGuildOpen.guild!.id);
                        mutate(`/api/authenticated/guilds?includeApiKeys=true`);
                    }}>
                        <button className='p-2 rounded-lg hover:bg-neutral-700'>
                            <TrashIcon className='size-6 stroke-red-500' />
                        </button>
                    </form>
                </div>
            </div>
        </Dialog>
    );
}