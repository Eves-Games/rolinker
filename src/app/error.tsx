'use client';

export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className='container flex flex-col items-center gap-4 my-4'>
            <h1 className='font-bold text-3xl'>Something went wrong!</h1>
            <p>{error.message}</p>
        </div>
    )
}