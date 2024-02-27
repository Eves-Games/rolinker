import { PlusIcon, StarIcon, TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';
import { Thumbnail, User } from '@/roblox-api';
import { auth, signIn } from '@/auth';
import Image from 'next/image';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const runtime = "edge";

async function setPrimary(id: string) {
  try {
    const session = await auth();

    const accountToSetPrimary = await db.account.findUnique({
      where: {
        id: id
      }
    });

    if (!accountToSetPrimary) {
      throw new Error('Account not found');
    }

    if (accountToSetPrimary.ownerId !== session?.user.id) {
      throw new Error('Unauthorized access');
    }

    await db.account.updateMany({
      where: {
        ownerId: accountToSetPrimary.ownerId,
        isPrimary: true
      },
      data: {
        isPrimary: false
      }
    });

    await db.account.update({
      where: {
        id: id
      },
      data: {
        isPrimary: true
      }
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function deleteAccount(id: string) {
  try {
    const session = await auth();

    const accountToDelete = await db.account.findUnique({
      where: {
        id: id
      }
    });

    if (!accountToDelete) {
      throw new Error('Account not found');
    }

    if (accountToDelete.ownerId !== session?.user.id) {
      throw new Error('Unauthorized access');
    }

    await db.account.delete({
      where: {
        id: id
      }
    });

    if (accountToDelete.isPrimary) {
      const nextAccount = await db.account.findFirst({
        where: {
          ownerId: accountToDelete.ownerId,
          NOT: {
            id: id
          }
        }
      });

      if (nextAccount) {
        await db.account.update({
          where: {
            id: nextAccount.id
          },
          data: {
            isPrimary: true
          }
        });
      }
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export default async function Page() {
  const session = await auth();

  const accounts = await db.account.findMany({
    where: {
      ownerId: session?.user.id
    },
    orderBy: {
      isPrimary: 'desc'
    }
  });

  const usersData = {
    userIds: accounts.map(account => account.id),
    excludeBannedUsers: true
  };

  const usersResponse = await fetch('https://users.roblox.com/v1/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usersData),
  })
    .then(response => { return response.json() });

  const thumbnailsResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-bust?userIds=${accounts.map(account => account.id).join(',')}&size=75x75&format=Png&isCircular=false`)
    .then(response => { return response.json() });

  const users: Array<User> = usersResponse.data;
  const thumbnails: Array<Thumbnail> = thumbnailsResponse.data;

  const doneAccounts = accounts.map(account => {
    const user = users.find(user => user.id.toString() === account.id);
    const thumbnail = thumbnails.find(thumbnail => thumbnail.targetId.toString() === account.id);

    return {
      ...account,
      name: user ? user.name : '',
      imageUrl: thumbnail ? thumbnail.imageUrl : ''
    };
  });

  return (
    <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-2 w-full'>
      {doneAccounts.map((account) => (
        <div key={account.id} className='flex items-center justify-between space-x-4 bg-neutral-800 w-full px-4 py-2 rounded shadow-lg'>
          <div className='flex items-center space-x-4'>
            <Image src={account.imageUrl} alt='Avatar Icon' className='h-16 w-16 rounded' width={100} height={100} />
            <span className='text-lg'>{account.name}</span>
          </div>
          <div className='flex items-center space-x-2'>
            {account.isPrimary ? (
              <div className="px-2 py-2 transition rounded">
                <SolidStarIcon className="h-6" />
              </div>
            ) : (
              <form action={async () => {
                'use server';

                await setPrimary(account.id);
                await revalidatePath('/');
              }}>
                <button className="px-2 py-2 transition hover:bg-neutral-700 rounded">
                  <StarIcon className="h-6" />
                </button>
              </form>
            )}
            <form action={async () => {
              'use server';

              await deleteAccount(account.id);
              await revalidatePath('/');
            }}>
              <button className="px-2 py-2 transition hover:bg-neutral-700 rounded">
                <TrashIcon className="h-6 stroke-red-500" />
              </button>
            </form>
          </div>
        </div>
      ))}
      <form className='col-span-full' action={async () => {
        'use server';

        await signIn("roblox");
      }}>
        <button className="px-4 py-2 w-full flex justify-center items-center transition hover:bg-neutral-700 bg-neutral-800 rounded shadow-lg">
          <PlusIcon className="h-16 w-6" />
        </button>
      </form>
    </div>
  );
};