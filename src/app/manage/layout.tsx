import Link from "next/link";
import { UsersIcon, CircleStackIcon, CodeBracketIcon, } from '@heroicons/react/24/outline'
import Block from "../_components/Block";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Manage'
};

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className='container my-4 max-w-screen-lg'>
            <h1 className='font-bold text-3xl mb-4'>Manage</h1>

            <div className='flex flex-col md:flex-row gap-4 items-start'>
                <div className="space-y-2">
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
                    <Block href='/manage/api-key' className='flex items-center justify-between gap-4 py-2 px-4 rounded'>
                        <CodeBracketIcon className="size-6" />
                        <span>API Key</span>
                    </Block>
                </div>
                {children}
            </div>
        </section>
    )
}