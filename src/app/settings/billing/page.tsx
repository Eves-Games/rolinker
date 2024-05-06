'use client';

import { BanknotesIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Page() {
    return (
        <div className='bg-neutral-800 rounded shadow-lg w-full px-4 py-2 space-y-4'>
            <div className='flex items-center space-x-4'>
                <BanknotesIcon className='size-6' />
                <span>Active Subscriptions</span>
            </div>
            <div className='flex justify-between items-center'>
                <h2>API Premium <span className='text-neutral-400'>($2.99/m)</span></h2>
                <button className='p-2 rounded-lg hover:bg-neutral-700'>
                    <XMarkIcon className='size-6' />
                </button>
            </div>
            <hr className='border-neutral-700' />
            <div className='flex justify-between items-center'>
                <h2>Rank Bot <span className='text-neutral-400'>($5.99/m)</span></h2>
                <button className='p-2 rounded-lg hover:bg-neutral-700'>
                    <XMarkIcon className='size-6' />
                </button>
            </div>
        </div>
    );
}