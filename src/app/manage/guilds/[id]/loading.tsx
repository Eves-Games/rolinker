export default function Loading() {
  return (
    <div className='bg-neutral-800 w-full px-4 py-2 rounded shadow-lg'>
        <div className='flex items-center space-x-4 animate-pulse w-full'>
            <div className='h-16 w-16 bg-neutral-700 rounded' />
            <div className='h-4 w-1/4 bg-neutral-700 rounded-full' />
        </div>
    </div>
);
}