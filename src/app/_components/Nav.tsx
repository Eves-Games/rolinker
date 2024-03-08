import Link from 'next/link';
import UserCard from './UserCard';
import { auth, signIn } from '@/auth';
import NavButton from '@/app/_components/NavButton';
import { RoLinkerLogo } from '@/app/_components/RoLinkerLogo';
import { DiscordLogo } from '@/app/_components/DiscordLogo';

export interface NavLink {
  name: string;
  href: string;
};

const NavLinks = [
  { name: 'Landing', href: '/' },
  { name: 'Commands', href: '/commands' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Support', href: 'https://discord.gg/CJDuGzwFX4' },
] satisfies Array<NavLink>;

export default async function Nav() {
  const session = await auth();

  return (
    <nav className='flex justify-between py-4 container'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-4 py-2'>
          <RoLinkerLogo />
          <span className='font-bold text-xl'>RoLinker</span>
        </div>
        <div className='hidden flex items-center gap-2 md:flex'>
          {NavLinks.map((navLink, index) => (
            <Link key={index} href={navLink.href} className='px-4 py-2 rounded hover:bg-neutral-800 hover:shadow-lg'>{navLink.name}</Link>
          ))}
        </div>
      </div>
      <div className='flex items-center gap-2'>
        {session?.user ? (
          <UserCard {...session.user} />
        ) : (
          <form action={async () => {
            'use server';
            await signIn('discord')
          }}>
            <button className='flex items-center gap-4 px-4 py-2 rounded transition-colors bg-[#5865F2] hover:bg-opacity-75 whitespace-nowrap'>
              <DiscordLogo />
              <span>Sign in</span>
            </button>
          </form>
        )}
        <NavButton navLinks={NavLinks} />
      </div >
    </nav >
  );
};