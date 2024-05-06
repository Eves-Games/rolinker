'use client';

import { useState } from 'react';
import { ArrowTopRightOnSquareIcon, BanknotesIcon, StarIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function Page() {
    const [inputValue, setInputValue] = useState('');

    const isInputValid = inputValue === 'Delete my account';

    return (
        <>
            <div className='bg-neutral-800 rounded shadow-lg w-full px-4 py-2 space-y-4'>
                <div className='flex items-center space-x-4'>
                    <BanknotesIcon className='size-6' />
                    <span>Active Subscriptions</span>
                </div>
                <div className='flex justify-between items-center'>
                    <h2 className='text-xl'>API Premium <span className='text-neutral-400'>($2.99/m)</span></h2>
                    <button onClick={() => signOut({ redirect: true, callbackUrl: '/' })} className='flex justify-between space-x-4 bg-red-600 rounded-lg py-2 px-4 shadow-lg hover:bg-red-500'>
                        <span className='truncate'>Cancel</span>
                        <XMarkIcon className='size-6 flex-shrink-0' aria-hidden='true' />
                    </button>
                </div>
                <hr className='border-neutral-700' />
                <div className='flex justify-between items-center'>
                    <h2 className='text-xl'>Rank Bot <span className='text-neutral-400'>($5.99/m)</span></h2>
                    <button onClick={() => signOut({ redirect: true, callbackUrl: '/' })} className='flex justify-between space-x-4 bg-red-600 rounded-lg py-2 px-4 shadow-lg hover:bg-red-500'>
                        <span className='truncate'>Cancel</span>
                        <XMarkIcon className='size-6 flex-shrink-0' aria-hidden='true' />
                    </button>
                </div>
            </div>
        </>
    );
}