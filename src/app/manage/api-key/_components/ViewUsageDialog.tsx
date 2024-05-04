'use client';

import { Dialog } from "@headlessui/react";
import { ChevronDoubleUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function ViewUsageDialog({
    dialogOpen,
    setDialogOpen,
    keyData,
}: {
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    keyData: {
        userId: string;
        key: string;
        usage: number;
    }
}) {
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
        const timer = setInterval(() => {
            setResetTimer(getTimeUntilReset());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Dialog open={dialogOpen} onClose={setDialogOpen} className='fixed inset-0 flex items-center justify-center z-50 px-4'>
            <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
            <div className='space-y-4 relative bg-neutral-800 rounded-lg px-6 py-4 shadow-lg'>
                <div className='flex space-x-4 justify-between items-center'>
                    <Dialog.Title className='text-2xl font-bold'>View Key Usage</Dialog.Title>
                    <button onClick={() => setDialogOpen(false)} className='p-2 text-gray-400 hover:text-gray-200'>
                        <XMarkIcon className='size-6' />
                    </button>
                </div>

                <div>
                    <h2 className='font-semibold text-lg'>Current Plan</h2>
                    <p>Free (750 Requests)</p>
                </div>

                <div>
                    <h2 className='font-semibold text-lg'>Usage Today</h2>
                    <p>{keyData.usage}/750</p>
                </div>

                <p>Usage resets in {resetTimer}</p>

                <button className={`flex justify-between space-x-4 bg-indigo-700 rounded-lg py-2 px-4 shadow-lg ${true ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-600'}`}>
                    <span className='truncate'>Upgrade Plan</span>
                    <ChevronDoubleUpIcon className='size-6 flex-shrink-0' aria-hidden='true' />
                </button>
            </div>
        </Dialog>
    );
}