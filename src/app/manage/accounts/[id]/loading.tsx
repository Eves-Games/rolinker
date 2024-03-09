import Block from "@/app/_components/Block";

export default function Loading() {
    return (
        <Block className='flex space-x-4 py-2 px-4 items-center w-full'>
            <div className='h-16 w-16 bg-neutral-700 rounded animate-pulse' />
            <div className='h-4 w-1/4 bg-neutral-700 rounded-full animate-pulse' />
        </Block>
    );
}