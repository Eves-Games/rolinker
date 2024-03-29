import { RoLinkerLogo } from '@/app/_components/RoLinkerLogo';
import db from '@/lib/db';
import { PlusIcon, ArrowRightIcon, CheckBadgeIcon, UserGroupIcon, CodeBracketIcon, GlobeAltIcon, InformationCircleIcon, CurrencyDollarIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
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
    <div className='space-y-16 mb-16'>
      <section className='bg-gradient-to-r from-red-800 to-[#E12626] py-16 shadow-lg'>
        <div className='container flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-x-4 lg:space-y-0 text-center lg:text-left'>
          <div className='flex flex-col gap-8 items-center lg:items-start'>
            <div className='flex items-center space-x-4'>
              <RoLinkerLogo className='size-16 sm:size-20' />
              <h1 className='font-black text-5xl sm:text-6xl'>RoLinker</h1>
            </div>
            <div>
              <h2 className='font-semibold text-2xl'>Connecting Roblox to Discord</h2>
              <p className='text-base sm:text-lg'>For group owners - divisions, web-management, developer API</p>
            </div>
            <Link className='flex items-center space-x-2 px-4 py-2 border-dashed border-2 rounded w-fit' href='https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id=990855457885278208&permissions=8&disable_guild_select=true&redirect_uri=https://rolinker.net/api/auth/guild&response_type=code'>
              <PlusIcon className='size-8 lg:size-6' />
              <span className='text-lg lg:text-base'>Add RoLinker bot</span>
              <ArrowRightIcon className='size-8 lg:size-6' />
            </Link>
          </div>
          <div className='space-y-4 sm:space-y-8'>
            <h2 className='font-bold text-4xl'>What we&#39;re linking</h2>
            <div className='space-x-2'>
              <span className='font-semibold text-xl sm:text-2xl px-2 border-dashed border-2 rounded w-fit'>{guildsCount}</span>
              <span className='text-xl sm:text-2xl'>Discord servers to Roblox groups</span>
            </div>
            <div className='space-x-2'>
              <span className='font-semibold text-xl sm:text-2xl px-2 border-dashed border-2 rounded w-fit'>{usersCount.length}</span>
              <span className='text-xl sm:text-2xl'>Discord users to</span>
              <span className='font-semibold text-xl sm:text-2xl px-2 border-dashed border-2 rounded w-fit'>{accountsCount}</span>
              <span className='text-xl sm:text-2xl'>Roblox accounts</span>
            </div>
          </div>
        </div>
      </section>
      <section className='container'>
        <div className='space-y-6 mb-12'>
          <h1 className='font-bold text-5xl'>Why RoLinker?</h1>
          <h2 className='text-3xl flex items-center'>
            Featureful and Easy <CheckBadgeIcon className='size-8 ml-2' />
          </h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-16'>
          <div className='flex items-center space-x-4'>
            <UserGroupIcon className='size-24' />
            <div>
              <h2 className='text-4xl mb-2'>Group Focused</h2>
              <p className='text-lg'>RoLinker is designed for group owners, with features like server divisions, generate roles, and multi-account group linking.</p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <CodeBracketIcon className='size-24' />
            <div>
              <h2 className='text-4xl mb-2'>Rich Developer API</h2>
              <p className='text-lg'>RoLinker is equipped with a rich API which can enable smart projects like auto-role bots and more.</p>
            </div>

          </div>
          <div className='flex items-center space-x-4'>
            <GlobeAltIcon className='size-24' />
            <div>
              <h2 className='text-4xl mb-2'>Fast. Really fast!</h2>
              <p className='text-lg'>RoLinker is deployed to the edge, making running commands and web management quick from wherever you are in the world.</p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <InformationCircleIcon className='size-24' />
            <div>
              <h2 className='text-4xl mb-2'>Endless Support</h2>
              <p className='text-lg'>RoLinker has a 24/7 support team and rich community involvement in improving the service - From bug hunts, to partnerships.</p>
            </div>
          </div>
        </div>
      </section>
      <section className='bg-gradient-to-r from-[#5865F2] to-indigo-700 py-16 shadow-lg'>
        <div className='container flex flex-col lg:flex-row justify-between items-center gap-8 text-center lg:text-left'>
          <div className='space-y-2'>
            <h1 className='font-bold text-5xl'>We&#39;re new!</h1>
            <h2 className='font-semibold text-2xl'>There are going to be bugs.</h2>
          </div>
          <h1 className='font-black text-7xl'>So...</h1>
          <div className='space-y-2'>
            <h1 className='font-bold text-4xl whitespace-nowrap'>Report bugs for <CurrencyDollarIcon className='size-12 inline-block' /></h1>
            <Link className='text-2xl hover:underline' href='https://discord.gg/yV2sSRJ9h5'>Using #support <ArrowTopRightOnSquareIcon className='size-8 inline-block' /></Link>
          </div>
        </div>
      </section>
    </div>
  );
};