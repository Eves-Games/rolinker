import Link from 'next/link';
import { auth, signIn } from '@/auth';
import { RoLinkerLogo } from '@/app/_components/RoLinkerLogo';
import { Book, Command, Menu, Settings, Sliders } from 'lucide-react';
import { ReactNode } from 'react';
import { DiscordLogo } from '../app/_components/DiscordLogo';
import NavUser from './NavUser';

export interface LinkHref {
  name: string;
  href: string;
  icon: ReactNode;
};

export const NavLinks = [
  { name: 'Commands', href: '/commands', icon: <Command className='size-5' /> },
  { name: 'Documentation', href: 'https://docs.rolinker.net', icon: <Book className='size-5' /> },
  { name: 'Discord', href: 'https://discord.gg/CJDuGzwFX4', icon: <DiscordLogo className='size-5' /> },
] satisfies Array<LinkHref>;

export const UserLinks = [
  { name: 'Manage', href: '/manage/accounts', icon: <Sliders className='size-5' /> },
  { name: 'Settings', href: '/settings/account', icon: <Settings className='size-5' /> }
] satisfies Array<LinkHref>;

async function handleSignIn() {
  "use server";

  await signIn('discord');
};

export default async function Nav() {
  const session = await auth();

  return (
    <div className='bg-base-100'>
      <nav className="navbar mx-auto max-w-screen-lg">
        <ul className="navbar-start menu menu-horizontal py-0 gap-2 flex-nowrap items-center">
          <div className="md:hidden dropdown dropdown-start">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              <Menu className='size-5' />
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
              {
                NavLinks.map(LinkHref => (
                  <li key={LinkHref.name}>
                    <Link href={LinkHref.href} className="justify-between">
                      {LinkHref.name}
                      {LinkHref.icon}
                    </Link>
                  </li>
                ))
              }
            </ul>
          </div>
          <Link href='/' className='btn btn-ghost'>
            <RoLinkerLogo className='size-6' />
            <h1 className="font-black text-xl">RoLinker</h1>
          </Link>
          {
            NavLinks.map(LinkHref => <li key={LinkHref.name} className='md:block hidden'><Link href={LinkHref.href}>{LinkHref.name}</Link></li>)
          }
        </ul>
        <div className='navbar-end'>
          {session?.user ? (
            <NavUser userLinks={UserLinks} {...session.user} />
          ) : (
            <form action={handleSignIn}>
              <button className='btn btn-ghost'>
                Sign in
                <DiscordLogo className='size-5' />
              </button>
            </form>
          )}
        </div>
      </nav>
    </div>
  );
};