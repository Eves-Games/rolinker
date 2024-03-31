import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function Loading() {
    return (
        <div className='flex justify-center items-center border-dashed border-4 border-neutral-800 rounded shadow-lg w-full h-20'>
            <ArrowPathIcon className='size-6 animate-spin' />
        </div>
    );
}