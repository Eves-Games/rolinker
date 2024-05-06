import { auth } from '@/auth';
import db from '@/lib/db';
import Developer from './Developer';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export const runtime = 'edge';

export default async function Page() {
    const session = await auth();

    if (!session) {
        return (
            <div className='flex justify-center items-center space-x-4 border-dashed border-4 border-neutral-800 rounded shadow-lg w-full h-20'>
                <ExclamationTriangleIcon className='size-6' />
                <span>Unauthorized</span>
            </div>
        );
    }

    const keyData = await db.apiKey.findUnique({
        where: { userId: session?.user.id }
    }) ?? await db.apiKey.create({
        data: { userId: session?.user.id }
    });

    return (
        <div className='w-full space-y-2'>
            <Developer keyData={keyData} />
        </div>
    );
};