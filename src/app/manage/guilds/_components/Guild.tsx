import { APIGuild } from "discord-api-types/v10";
import Link from "next/link";
import Image from 'next/image';

interface GuildProps {
    guild?: APIGuild | false,
    href?: string,
    className?: string,
    children?: React.ReactNode
}

export const Guild: React.FC<GuildProps> = ({ guild, href, className, children }) => {
    let content = (
        <div className={className + ' flex items-center space-x-4 animate-pulse w-full'}>
            <div className='h-16 w-16 bg-neutral-700 rounded' />
            <div className='h-4 w-1/4 bg-neutral-700 rounded-full' />
        </div>
    );

    if (guild === false) {
        content = (
            <>
                <div className='flex items-center space-x-4'>
                    <div className='h-16 w-16 flex items-center justify-center'>
                        <span className='text-4xl'>U</span>
                    </div>
                    <span className='text-lg'>Unauthorized</span>
                </div>
                <div className='flex items-center gap-4'>
                    {children}
                </div>
            </>
        );
    } else if (guild !== undefined) {
        content = (
            <>
                <div className='flex items-center space-x-4'>
                    {guild.icon ? (
                        <Image src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={`${guild.name} Icon`} className='h-16 w-16 rounded' width={100} height={100} />
                    ) : (
                        <div className='h-16 w-16 flex items-center justify-center'>
                            <span className='text-4xl'>{guild.name.charAt(0)}</span>
                        </div>
                    )}
                    <span className='text-lg'>{guild.name}</span>
                </div>
                <div className='flex items-center gap-4'>
                    {children}
                </div>
            </>
        );
    };

    return href ? (
        <Link href={href} className={className + ' flex items-center justify-between space-x-4 bg-neutral-800 w-full px-4 py-2 rounded shadow-lg hover:bg-neutral-700'}>
            {content}
        </Link>
    ) : (
        <div className={className + ' flex items-center justify-between space-x-4 bg-neutral-800 w-full px-4 py-2 rounded shadow-lg'}>
            {content}
        </div>
    );
};

export default Guild;