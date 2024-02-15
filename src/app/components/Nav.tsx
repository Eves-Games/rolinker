import Link from 'next/link';
import Image from 'next/image';
import brandIcon from '../assets/brandIcon.png';
import { getServerSession } from 'next-auth/next';
import { options } from '../api/auth/[...nextauth]/options';
import UserCard from './UserCard';
import SignInCard from './SignInCard';

export default async function Nav() {
  const session = await getServerSession(options);

  return (
    <nav className='flex justify-between py-2'>
      <div className='flex items-center space-x-4'>
        <Link href='/' className='flex items-center space-x-4 py-2'>
          <Image src={brandIcon} alt='Brand Icon' className='h-8 w-8' />
          <span className='font-bold text-xl'>RoLinker</span>
        </Link>
        <div className='flex items-center space-x-2 py-2'>
          <Link href='/' className='px-4 py-2 rounded hover:bg-neutral-800 hover:shadow-lg'>Home</Link>
          <Link href='/commands' className='px-4 py-2 rounded hover:bg-neutral-800 hover:shadow-lg'>Commands</Link>
        </div>
      </div>
      <div className='flex items-center'>
        {session?.user ? (
          <UserCard {...session.user} />
        ) : (
          <SignInCard />
        )}
      </div >
    </nav >
  );
}
