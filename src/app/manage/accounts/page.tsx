import { auth } from '@/auth';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { RESTGetAPICurrentUserGuildsResult, Routes } from 'discord-api-types/v10';
import { createUserRest } from '@/lib/discord/rest';
import { getDetailedAccounts } from '@/lib/accounts';
import Accounts from './Accounts';

export const runtime = 'edge';

export default async function Page() {
    const session = await auth();

    const userRest = createUserRest(session?.user.access_token);
    const detailedAccounts = await getDetailedAccounts(session?.user.id)

    if (!detailedAccounts) {
        return (
            <div className='flex justify-center items-center space-x-4 border-dashed border-4 border-neutral-800 rounded shadow-lg w-full h-20'>
                <ExclamationTriangleIcon className='size-6' />
                <span>Error loading accounts</span>
            </div>
        );
    };

    return (
        <Accounts accounts={detailedAccounts} />
    );
};