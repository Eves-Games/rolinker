'use client';

import { useState } from 'react';
import { ArrowTopRightOnSquareIcon, DocumentChartBarIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteAccount } from './actions';
import { signOut } from 'next-auth/react';

export default function Page() {
    const [inputValue, setInputValue] = useState('');

    const isInputValid = inputValue === 'Delete my account';

    return (
        <div className='w-full space-y-2'>
            <div className='bg-neutral-800 rounded shadow-lg w-full px-4 py-2 space-y-4'>
                <div className='flex items-center space-x-4'>
                    <DocumentChartBarIcon className='size-6' />
                    <span>Your Data</span>
                </div>
                <div className='gap-4 grid grid-cols-1 md:grid-cols-1'>
                    <div className='space-y-2 relative'>
                        <span>Delete Account</span>
                        <form action={deleteAccount} className='flex space-x-2'>
                            <input onChange={(e) => setInputValue(e.target.value)} value={inputValue} type='text' placeholder="Enter 'Delete my account'" className='flex justify-between space-x-4 w-full bg-neutral-700 hover:bg-neutral-600 rounded-lg py-2 px-4 shadow-lg' />
                            <button onClick={() => signOut({ redirect: true, callbackUrl: '/' })} className={`flex justify-between space-x-4 bg-red-600 rounded-lg py-2 px-4 shadow-lg ${!isInputValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500'}`} disabled={!isInputValid}>
                                <span className='truncate'>Delete Account</span>
                                <TrashIcon className='size-6 flex-shrink-0' aria-hidden='true' />
                            </button>
                        </form>
                    </div>
                </div>
                <p className='text-center'>This will delete all your data. <Link href='/privacy-policy' className='text-blue-500 hover:underline' target='_blank'>Privacy Policy <ArrowTopRightOnSquareIcon className="size-5 inline-block" /></Link></p>
            </div>
        </div>
    );
}