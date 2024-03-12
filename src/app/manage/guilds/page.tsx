import { APIGuild as OriginalAPIGuild } from 'discord-api-types/v10';
import { auth } from '@/auth';
import { getUserGuilds } from '@/lib/guilds';
import Image from 'next/image';
import Block from '@/app/_components/Block';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export const runtime = 'edge';

interface APIGuild extends OriginalAPIGuild {
    id: string;
}

export default async function Page() {
    const session = await auth();

    const guilds: Array<APIGuild> | null = await getUserGuilds(session?.user.access_token);

    if (!guilds) {
        return (
            <div>You are apart of no guilds!</div>
        );
    };

    const ownedGuilds: Array<APIGuild> = guilds.filter(guild => guild.owner === true);

    if (ownedGuilds.length === 0) {
        return (
            <div>You own no guilds!</div>
        );
    };

    return (
        <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-2 w-full'>
            {ownedGuilds.length !== 0 && ownedGuilds.map((guild, index) => (
                <Block key={guild.id} href={`/manage/guilds/${guild.id}`} className='px-4 py-2 flex space-x-4 items-center'>
                    {guild.icon ? (
                        <Image src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={`${guild.name} Icon`} className='size-16 rounded' width={100} height={100} />
                    ) : (
                        <div className='size-16 flex items-center justify-center'>
                            <span className='text-4xl'>{guild.name.charAt(0)}</span>
                        </div>
                    )}
                    <span className='text-lg'>{guild.name}</span>
                </Block>
            ))}
            <Link className='flex space-x-4 px-4 py-2 justify-center items-center border-dashed border-4 border-neutral-800 rounded shadow-lg hover:border-neutral-700 h-20' href='https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id=990855457885278208&permissions=8&disable_guild_select=true&redirect_uri=https://rolinker.net/api/auth/guild&response_type=code'>
                <span>Add Guild</span>
                <PlusIcon className='size-6' />
            </Link>
        </div>
    );
};