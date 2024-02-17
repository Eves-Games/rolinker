import AddAccount from '../../components/AddAccount'
import { AccountItem } from '@/app/components/AccountItem';
import { Thumbnail, User } from '@/roblox-api';
import { auth } from '@/auth';
import db from '@/db';

export const runtime = "edge";

async function setPrimary(id: string) {
  'use server';

  try {
    const session = await auth();

    const accountToSetPrimary = await db.accounts.findUnique({
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

    await db.accounts.updateMany({
      where: {
        ownerId: accountToSetPrimary.ownerId,
        isPrimary: true
      },
      data: {
        isPrimary: false
      }
    });

    await db.accounts.update({
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
  'use server';

  try {
    const session = await auth();

    const accountToDelete = await db.accounts.findUnique({
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

    await db.accounts.delete({
      where: {
        id: id
      }
    });

    if (accountToDelete.isPrimary) {
      const nextAccount = await db.accounts.findFirst({
        where: {
          ownerId: accountToDelete.ownerId,
          NOT: {
            id: id
          }
        }
      });

      if (nextAccount) {
        await db.accounts.update({
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

export default async function ManageAccounts() {
  const session = await auth();

  const accounts = await db.accounts.findMany({
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
    <div className='flex-col space-y-2 w-full'>
      {doneAccounts.map((account) => (
        <AccountItem key={account.id} {...account} deleteAccount={deleteAccount} setPrimary={setPrimary} />
      ))}
      <AddAccount />
    </div>
  );
};