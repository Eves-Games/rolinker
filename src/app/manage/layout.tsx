import Link from "next/link";
import { UsersIcon, CircleStackIcon } from '@heroicons/react/24/outline'

export default function ManageLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className='container'>
            <h1 className='font-bold text-3xl mb-4'>Manage</h1>

            <div className='flex space-x-4 items-start'>
                <div className='bg-neutral-800 rounded shadow-lg'>
                    <Link href='/manage/accounts' className='flex items-center justify-between space-x-4 w-full px-4 py-2 hover:bg-neutral-700 rounded-t'>
                        <UsersIcon className="h-6" />
                        <span>Accounts</span>
                    </Link>
                    <Link href='/manage/servers' className='flex items-center justify-between space-x-4 w-full px-4 py-2 hover:bg-neutral-700 rounded-b'>
                        <CircleStackIcon className="h-6" />
                        <span>Servers</span>
                    </Link>
                </div>
                {children}
            </div>
        </section>
    )
}