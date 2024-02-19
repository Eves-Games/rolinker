'use client';

import { StarIcon, TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface AccountItemProps {
    id: string;
    name: string;
    imageUrl: string;
    isPrimary: boolean;
    deleteAccount: (id: string) => Promise<boolean>;
    setPrimary: (id: string) => Promise<boolean>;
}

export function AccountItem({ id, name, imageUrl, isPrimary, deleteAccount, setPrimary }: AccountItemProps) {
    const router = useRouter();

    return (
        <div className='flex items-center justify-between space-x-4 bg-neutral-800 w-full px-4 py-2 rounded shadow-lg'>
            <div className='flex items-center space-x-4'>
                <Image src={imageUrl} alt='Avatar Icon' className='h-16 w-16 rounded' width={100} height={100} />
                <span className='text-lg'>{name}</span>
            </div>
            <div className='flex items-center space-x-2'>
                {isPrimary ? (
                    <div className="px-2 py-2 transition rounded">
                        <SolidStarIcon className="h-6" />
                    </div>
                ) : (
                    <button onClick={() => setPrimary(id).then(() => router.refresh())} className="px-2 py-2 transition hover:bg-neutral-700 rounded">
                        <StarIcon className="h-6" />
                    </button>
                )}
                <button onClick={() => deleteAccount(id).then(() => router.refresh())} className="px-2 py-2 transition hover:bg-neutral-700 rounded">
                    <TrashIcon className="h-6 stroke-red-500" />
                </button>
            </div>
        </div>
    )
}