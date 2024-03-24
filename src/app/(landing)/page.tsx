import { RoLinkerLogo } from '@/app/_components/RoLinkerLogo';
import db from '@/lib/db';
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function Page() {
  const guildsCount = await db.guild.count();
  const usersCount = await db.account.findMany({
    distinct: ['userId'],
    select: {
      userId: true
    }
  });
  const accountsCount = await db.account.count();

  return (
    <>
      <section className='bg-gradient-to-r from-red-800 to-[#E12626] py-16'>
        <div className='container flex justify-between items-center'>
          <div className='space-y-8'>
            <div className='flex items-center space-x-4'>
              <RoLinkerLogo className='size-20' />
              <h1 className='font-bold text-6xl'>RoLinker</h1>
            </div>
            <div>
              <h2 className='font-semibold text-2xl'>Connecting Roblox to Discord</h2>
              <p className='text-lg'>For group owners - divisions, web-management, developer API</p>
            </div>
            <Link className='flex items-center space-x-4 px-4 py-2 border-dashed border-2 rounded w-fit' href='https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id=990855457885278208&permissions=8&disable_guild_select=true&redirect_uri=https://rolinker.net/api/auth/guild&response_type=code'>
              <PlusIcon className='size-6' />
              <span>Add RoLinker bot</span>
              <ArrowRightIcon className='size-6' />
            </Link>
          </div>
          <div className='space-y-12'>
          <h2 className='font-semibold text-4xl'>What we&#39;re linking</h2>
            <div className='space-x-2'>
              <span className='font-semibold text-2xl px-2 border-dashed border-2 rounded w-fit'>{guildsCount}</span>
              <span className='text-2xl'>Discord servers to Roblox groups</span>
            </div>
            <div className='space-x-2'>
              <span className='font-semibold text-2xl px-2 border-dashed border-2 rounded w-fit'>{usersCount.length}</span>
              <span className='text-2xl'>Discord users to</span>
              <span className='font-semibold text-2xl px-2 border-dashed border-2 rounded w-fit'>{accountsCount}</span>
              <span className='text-2xl'>Roblox accounts</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};