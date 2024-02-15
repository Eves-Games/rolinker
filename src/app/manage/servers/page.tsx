import prisma from "@/db";
import { getServerSession } from 'next-auth';
import { options } from '../../api/auth/[...nextauth]/options';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

export default async function ManageServer() {
    const session = await getServerSession(options);

    const servers = await prisma.server.findMany({
        where: {
            ownerId: session?.user.id
        }
    })

    return (
        <div className='flex-col space-y-2 w-full'>
            {servers.map((server) => (
                <div key={server.id} className='flex items-center justify-between space-x-4 bg-neutral-800 w-full px-4 py-2 rounded shadow-lg'>
                    <div className='flex items-center space-x-4'>
                        {server.imageUrl ? (
                            <Image src={server.imageUrl} alt={`${server.name} Icon`} className='h-16 w-16 rounded' width={100} height={100} />
                        ) : (
                            <div className='h-16 w-16 flex items-center justify-center'>
                                <span className='text-4xl'>{server.name.charAt(0)}</span>
                            </div>
                        )}
                        <span className='text-lg'>{server.name}</span>
                    </div>
                    <Link href={`/manage/servers/${server.id}`} className="flex items-center space-x-2 px-2 py-2 transition rounded hover:bg-neutral-700">
                        <PencilIcon className="h-6" />
                    </Link>
                </div>
            ))}
            <a href='https://discord.com/api/oauth2/authorize?client_id=990855457885278208&permissions=8&scope=bot+applications.commands' target='_blank' className="px-4 py-2 w-full flex justify-center items-center transition hover:bg-neutral-700 bg-neutral-800 rounded shadow-lg">
                <PlusIcon className="h-16 w-6" />
            </a>
        </div>
    );
};