'use client';

import useSWR from 'swr';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { deleteAccount, updatePrimaryAccount } from './actions';
import { StarIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';

export const runtime = 'edge';

interface Account {
  id: string;
  ownerId: string;
  isPrimary: boolean;
  guildIds: string[];
  name: string;
  imageUrl: string;
}

const fetcher = async (url: string) => fetch(url).then(async r => await r.json() as Account[]);

export default function Page() {
  const session = useSession();

  const { data: initialAccounts, error, isLoading } = useSWR(
    session.data ? `/api/user/${session.data?.user.id}/accounts` : null,
    fetcher
  );

  const [primaryId, setPrimaryId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    if (initialAccounts) {
      setAccounts(initialAccounts);
      const primaryAccount = initialAccounts.find((account) => account.isPrimary);
      setPrimaryId(primaryAccount?.id || null);
    }
  }, [initialAccounts]);

  if (isLoading || !primaryId) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading accounts</div>;
  }

  const primaryAccount = accounts.find((account) => account.id === primaryId);
  const otherAccounts = accounts.filter((account) => account.id !== primaryId);

  return (
    <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-2 w-full'>
      {primaryAccount && (
        <div className='flex justify-between items-center bg-neutral-800 px-4 py-2 rounded shadow-lg'>
          <div className='flex items-center space-x-4'>
            <Image src={primaryAccount.imageUrl} alt='Avatar Icon' className='h-16 w-16 rounded' width={100} height={100} />
            <span className='text-lg'>{primaryAccount.name}</span>
          </div>
          <div className='px-2 py-2 rounded'>
            <SolidStarIcon className='h-6' />
          </div>
        </div>
      )}
      {otherAccounts.map((account) => (
        <div className='flex justify-between items-center bg-neutral-800 px-4 py-2 rounded shadow-lg' key={account.id}>
          <div className='flex items-center space-x-4'>
            <Image src={account.imageUrl} alt='Avatar Icon' className='size-16 rounded' width={100} height={100} />
            <span className='text-lg'>{account.name}</span>
          </div>
          <div className='flex justify-between space-x-2'>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setPrimaryId(account.id);
              await updatePrimaryAccount(account.id);
            }}>
              <button className='px-2 py-2 rounded hover:bg-neutral-600'>
                <StarIcon className='size-6' />
              </button>
            </form>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setAccounts((prevAccounts) => prevAccounts.filter((accountEntry) => accountEntry.id !== account.id));
              await deleteAccount(account.id);
            }}>
              <button className='px-2 py-2 rounded hover:bg-neutral-600'>
                <TrashIcon className='size-6 stroke-red-500' />
              </button>
            </form>
          </div>
        </div>
      ))}
      <form action={async () => {
        await signIn('roblox');
      }}>
        <button className='flex space-x-4 px-4 py-2 justify-center items-center border-dashed border-4 border-neutral-800 rounded shadow-lg hover:border-neutral-700 w-full h-20'>
          <span>Add Account</span>
          <PlusIcon className='size-6' />
        </button>
      </form>
    </div>
  );
}