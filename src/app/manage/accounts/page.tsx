import axios from 'axios';
import prisma from "@/db";
import { getServerSession } from 'next-auth';
import { options } from '../../api/auth/[...nextauth]/options';
import AddAccount from '../../components/AddAccount'
import { AccountItem } from '@/app/components/AccountItem';
import { Thumbnail, User } from '@/roblox-api';

async function setPrimary(id: string) {
  'use server';

  try {
    const session = await getServerSession(options);

    const accountToSetPrimary = await prisma.accounts.findUnique({
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

    await prisma.accounts.updateMany({
      where: {
        ownerId: accountToSetPrimary.ownerId,
        isPrimary: true
      },
      data: {
        isPrimary: false
      }
    });

    await prisma.accounts.update({
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
    const session = await getServerSession(options);

    const accountToDelete = await prisma.accounts.findUnique({
      where: {
        id: id
      }
    });

    if (!accountToDelete) {
      throw new Error('Account not found');
    }

    if (accountToDelete.ownerId !== session?.user.discordId) {
      throw new Error('Unauthorized access');
    }

    await prisma.accounts.delete({
      where: {
        id: id
      }
    });

    if (accountToDelete.isPrimary) {
      const nextAccount = await prisma.accounts.findFirst({
        where: {
          ownerId: accountToDelete.ownerId,
          NOT: {
            id: id
          }
        }
      });

      if (nextAccount) {
        await prisma.accounts.update({
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
  const session = await getServerSession(options);

  const accounts = await prisma.accounts.findMany({
    where: {
      ownerId: session?.user.discordId
    },
    orderBy: {
      isPrimary: 'desc'
    }
  });
  
  const usersData = {
    userIds: accounts.map(account => account.id),
    excludeBannedUsers: true
  }

  const usersResponse = await axios.post('https://users.roblox.com/v1/users', usersData)

  const thumbnailsData = accounts.map(account => {
    return {
      targetId: account.id,
      type: 'AvatarBust',
      size: '75x75',
      isCircular: false
    }
  })

  const thumbnailsResponse = await axios.post('https://thumbnails.roblox.com/v1/batch', thumbnailsData)

  const users: Array<User> = usersResponse.data.data
  const thumbnails: Array<Thumbnail> = thumbnailsResponse.data.data

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