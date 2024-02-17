import Link from 'next/link';
import Image from 'next/image';
import UserCard from './UserCard';
import SignInCard from './SignInCard';
import { auth } from '../../auth';

export default async function Nav() {
  const session = await auth();

  return (
    <nav className='flex justify-between py-4 container'>
      <div className='flex items-center gap-4'>
        <Link href='/' className='flex items-center gap-4'>
          <Image src='/rolinker.png' alt='Brand Icon' className='h-8 w-8' height={64} width={64} />
          <span className='font-bold text-xl'>RoLinker</span>
        </Link>
        <div className='flex items-center gap-2'>
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
