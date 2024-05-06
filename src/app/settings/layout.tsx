import Link from "next/link";
import { ExclamationTriangleIcon, UserIcon, WalletIcon } from '@heroicons/react/24/outline'
import Block from "../_components/Block";
import { auth } from "@/auth";
import Image from 'next/image';

export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth();

    if (!session) {
        return (
            <section className='container my-4 max-w-screen-lg'>
                <div className='flex justify-center items-center space-x-4 border-dashed border-4 border-neutral-800 rounded shadow-lg w-full h-20'>
                    <ExclamationTriangleIcon className='size-6' />
                    <span>Unauthorized</span>
                </div>
            </section>
        );
    }

    return (
        <section className='container my-4 max-w-screen-lg'>
            <h1 className='font-bold text-3xl mb-4'>Settings</h1>

            <div className='flex flex-col md:flex-row gap-4 items-start'>
                <Block>
                    <Link href='/settings/account' className='flex items-center justify-between gap-4 py-2 px-4 hover:bg-neutral-700 rounded'>
                        <UserIcon className="size-6" />
                        <span>Account</span>
                    </Link>
                    <Link href='/settings/billing' className='flex items-center justify-between gap-4 py-2 px-4 hover:bg-neutral-700 rounded'>
                        <WalletIcon className="size-6" />
                        <span>Billing</span>
                    </Link>
                </Block>
                <div className='w-full space-y-2'>
                    <div className='flex items-center space-x-4 bg-neutral-800 px-4 py-2 rounded shadow-lg w-full' key={session.user.image}>
                        <Image src={session.user.image} alt={`${session.user.name} Icon`} className='size-16 rounded-full' width={100} height={100} />
                        <span className='text-lg'>{session.user.name}</span>
                    </div>
                    {children}
                </div>
            </div>
        </section>
    )
}