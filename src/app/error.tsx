'use client';

export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className='flex flex-col items-center gap-4'>
            <h1 className='font-bold text-3xl'>Something went wrong!</h1>
            <button onClick={() => reset()} className='px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded w-fit'>
                Try again
            </button>
            <p>Error Code: #{error.digest}</p>
        </div>
    )
}