import Link from "next/link";
import { UsersIcon, CircleStackIcon, CodeBracketIcon, Cog6ToothIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import Block from "../_components/Block";

export default function ManageLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className='container my-4 max-w-screen-lg'>
            <h1 className='font-bold text-3xl mb-4'>Manage</h1>

            <div className='md:flex gap-4 items-start'>
                <div className='flex flex-col gap-2 mb-2 w-fit'>
                    <Block>
                        <Link href='/manage/accounts' className='flex items-center justify-between gap-4 py-2 px-4 hover:bg-neutral-700 rounded'>
                            <UsersIcon className="size-6" />
                            <span>Accounts</span>
                        </Link>
                        <Link href='/manage/guilds' className='flex items-center justify-between gap-4 py-2 px-4 hover:bg-neutral-700 rounded'>
                            <CircleStackIcon className="size-6" />
                            <span>Guilds</span>
                        </Link>
                    </Block>
                    <Block>
                        <Link href='/manage/settings' className='flex items-center justify-between gap-4 py-2 px-4 hover:bg-neutral-700 rounded'>
                            <Cog6ToothIcon className="size-6" />
                            <span>Settings</span>
                        </Link>
                        <Link href='/manage/billing' className='flex items-center justify-between gap-4 py-2 px-4 hover:bg-neutral-700 rounded'>
                            <CreditCardIcon className="size-6" />
                            <span>Billing</span>
                        </Link>
                    </Block>
                    <Link href='/manage/developer' className='flex items-center justify-between gap-4 py-2 px-4 bg-neutral-800 hover:bg-neutral-700 rounded'>
                        <CodeBracketIcon className="size-6" />
                        <span>Dev API</span>
                    </Link>
                </div>
                {children}
            </div>
        </section>
    )
}