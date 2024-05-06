import Link from "next/link";
import { UserIcon, WalletIcon } from '@heroicons/react/24/outline'
import Block from "../_components/Block";

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
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
                {children}
            </div>
        </section>
    )
}