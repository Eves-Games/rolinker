import prisma from "@/lib/db";
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import { APIGuild } from "discord-api-types/v10"
import Link from 'next/link';
import Image from 'next/image';
import { auth } from "@/auth";

export const runtime = "edge";

export default async function Page() {
    const session = await auth();

    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
            Authorization: 'Bearer ' + session?.user.access_token
        }
    });

    if (!guildsRes.ok) {
        throw new Error('Failed to fetch guilds');
    };

    const guilds: Array<APIGuild> = await guildsRes.json();
    const ownedGuilds: Array<APIGuild> = guilds.filter(guild => guild.owner === true);

    const fetchGuildPreview = async (guild: APIGuild) => {
        const guildRes = await fetch(`https://discord.com/api/v10/guilds/${guild.id}/preview`, {
            headers: {
                Authorization: 'Bot ' + process.env.DISCORD_BOT_TOKEN,
            }
        });
    
        return await guildRes.json();
    };
    
    const activeGuildsPromises = ownedGuilds.map(guild => fetchGuildPreview(guild));
    const activeGuilds = await Promise.all(activeGuildsPromises);
    
    console.log(activeGuilds);

    if (guilds.length === 0) {
        return (
            <a href='https://discord.com/api/oauth2/authorize?client_id=990855457885278208&permissions=8&scope=bot+applications.commands' target='_blank' className="px-4 py-2 w-full flex justify-center items-center transition hover:bg-neutral-700 bg-neutral-800 rounded shadow-lg">
                <PlusIcon className="h-16 w-6" />
            </a>
        )
    }

    const guildIds: Array<string> = guilds.map(guild => guild.id);


    const knownGuilds = await prisma.guild.findMany({
        where: {
            id: {
                in: guildIds
            }
        }
    });

    knownGuilds.sort((guildA, guildB) => {
        if (guildA.ownerId === session?.user.id) {
            return -1;
        } else if (guildB.ownerId === session?.user.id) {
            return 1;
        } else {
            return 0;
        }
    });

    return (
        <div className='flex-col space-y-2 w-full'>
            {knownGuilds.map((guild) => (
                <div key={guild.id} className='flex items-center justify-between space-x-4 bg-neutral-800 w-full px-4 py-2 rounded shadow-lg'>
                    <div className='flex items-center space-x-4'>
                        {guild.imageUrl ? (
                            <Image src={guild.imageUrl} alt={`${guild.name} Icon`} className='h-16 w-16 rounded' width={100} height={100} />
                        ) : (
                            <div className='h-16 w-16 flex items-center justify-center'>
                                <span className='text-4xl'>{guild.name.charAt(0)}</span>
                            </div>
                        )}
                        <span className='text-lg'>{guild.name}</span>
                    </div>
                    {guild.ownerId === session?.user.id && (
                        <Link href={`/manage/guilds/${guild.id}`} className="flex items-center space-x-2 px-2 py-2 transition rounded hover:bg-neutral-700">
                            <PencilIcon className="h-6" />
                        </Link>
                    )}
                </div>
            ))}
            <a href='https://discord.com/api/oauth2/authorize?client_id=990855457885278208&permissions=8&scope=bot+applications.commands' target='_blank' className="px-4 py-2 w-full flex justify-center items-center transition hover:bg-neutral-700 bg-neutral-800 rounded shadow-lg">
                <PlusIcon className="h-16 w-6" />
            </a>
        </div>
    );
};