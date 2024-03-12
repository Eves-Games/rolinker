'use client';

import { ThumbnailBatchResponse, GetUserResponse } from 'roblox-api-types';
import useSWR from 'swr';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { deleteAccount, setPrimaryAccount } from './actions';
import { StarIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';

interface Account {
  id: string;
  ownerId: string;
  isPrimary: boolean;
  guildIds: string[];
}

const fetcher = async (url: string) => {
  const accountsResponse = await fetch(url).then((res) => res.json());
  const accounts: Account[] = accountsResponse;

  const usersResponse = await fetch('https://users.roproxy.com/v1/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userIds: accounts.map((account) => parseInt(account.id)),
      excludeBannedUsers: true,
    }),
  }).then((res) => res.json());

  const users: GetUserResponse[] = usersResponse.data;

  const thumbnailsResponse = await fetch(`https://thumbnails.roproxy.com/v1/users/avatar-bust?userIds=${accounts.map(account => account.id).join(',')}&size=75x75&format=Png&isCircular=false`).then(
    (res) => res.json()
  );

  const thumbnails: ThumbnailBatchResponse[] = thumbnailsResponse.data;

  return accounts.map((account) => {
    const user = users.find((user) => user.id.toString() === account.id);
    const thumbnail = thumbnails.find((thumbnail) => thumbnail.targetId.toString() === account.id);

    return {
      ...account,
      name: user ? user.name : '',
      imageUrl: thumbnail ? thumbnail.imageUrl : '',
    };
  });
};

export default function Page() {
  const session = useSession();

  const { data: accounts, error, isLoading } = useSWR(
    session.data ? `/api/user/${session.data?.user.id}/accounts` : null,
    fetcher
  );
  if (isLoading) {
    return <div>Loading...</div>;
  };

  if (error || !accounts) {
    return <div>Error loading accounts</div>;
  };

  const [primaryId, setPrimaryId] = useState(accounts.find(account => account.isPrimary)?.id || '');

  const primaryAccount = accounts.find((account) => account.id === primaryId);
  const otherAccounts = accounts.filter((account) => account.id !== primaryId);

  return (
    <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-2 w-full">
      {primaryAccount && (
        <div className="flex justify-between items-center bg-neutral-800 px-4 py-2 rounded shadow-lg">
          <div className="flex items-center space-x-4">
            <Image src={primaryAccount.imageUrl} alt="Avatar Icon" className="h-16 w-16 rounded" width={100} height={100} />
            <span className="text-lg">{primaryAccount.name}</span>
          </div>
          <div className="px-2 py-2 rounded">
            <SolidStarIcon className="h-6" />
          </div>
        </div>
      )}
      {otherAccounts.map((account) => (
        <div className="flex justify-between items-center bg-neutral-800 px-4 py-2 rounded shadow-lg" key={account.id}>
          <div className="flex items-center space-x-4">
            <Image src={account.imageUrl} alt="Avatar Icon" className="h-16 w-16 rounded" width={100} height={100} />
            <span className="text-lg">{account.name}</span>
          </div>
          <div className="flex justify-between space-x-2">
            <form onSubmit={async (e) => {
              e.preventDefault();
              setPrimaryId(account.id);
              await setPrimaryAccount(account.id);
            }}>
              <button className="px-2 py-2 rounded hover:bg-neutral-600">
                <StarIcon className="h-6" />
              </button>
            </form>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await deleteAccount(account.id);
            }}>
              <button className="px-2 py-2 rounded hover:bg-neutral-600">
                <TrashIcon className="h-6 stroke-red-500" />
              </button>
            </form>
          </div>
        </div>
      ))}
      <form
        className="flex border-dashed border-4 border-neutral-800 rounded shadow-lg hover:border-neutral-700"
        action={async () => {
          await signIn('roblox');
        }}
      >
        <button className="flex space-x-4 px-4 py-2 justify-center items-center w-full">
          <span>Add Account</span>
          <PlusIcon className="h-16 w-6" />
        </button>
      </form>
    </div>
  );
}