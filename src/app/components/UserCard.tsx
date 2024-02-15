'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Cog6ToothIcon, AdjustmentsHorizontalIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';

interface UserProps {
  name: string;
  email: string;
  image: string;
  discordId: string;
}

export default function UserCard({ name, image }: UserProps)  {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDropdownOpen && !target.closest('.dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [isDropdownOpen]);

  return (
    <div className='relative flex-col space-y-3'>
      <button onClick={toggleDropdown} className={`flex items-center space-x-4 px-4 py-2 rounded ${isDropdownOpen ? 'bg-neutral-800 shadow-lg' : 'hover:bg-neutral-800 hover:shadow-lg'}`}>
        <span className='font-semibold'>{name}</span>
        <Image src={image || ''} width={32} height={32} alt='Profile Icon' className='h-8 w-8 rounded-full' />
      </button>
      <div ref={dropdownRef} className={`absolute right-0 bg-neutral-800 shadow-lg rounded min-w-full ${!isDropdownOpen && 'hidden'}`}>
        <Link href='/manage/accounts' className='flex items-center justify-between space-x-4 w-full px-4 py-2 hover:bg-neutral-700 rounded-t'>
          <span className='text-sm'>Manage</span>
          <AdjustmentsHorizontalIcon className="h-6 w-6" />
        </Link>
        <Link href='/settings' className='flex items-center justify-between space-x-4 w-full px-4 py-2 hover:bg-neutral-700'>
          <span className='text-sm'>Settings</span>
          <Cog6ToothIcon className="h-6 w-6" />
        </Link>
        <button onClick={() => signOut()} className='flex items-center justify-between space-x-4 w-full px-4 py-2 hover:bg-neutral-700 rounded-b'>
          <span className='text-sm'>Logout</span>
          <ArrowLeftEndOnRectangleIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};