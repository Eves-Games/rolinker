import { APIGuild } from "discord-api-types/v10"
import Image from 'next/image';
import { auth } from "@/auth";
import { getUserGuilds } from "@/lib/guilds";
import Link from "next/link";

export const runtime = "edge";

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
            {ownedGuilds.length !== 0 && ownedGuilds.map((guild) => (
                <Link key={guild.id} href={`/manage/guilds/${guild.id}`} className={`flex items-center space-x-4 bg-neutral-800 w-full px-4 py-2 rounded shadow-lg hover:bg-neutral-700 ${ownedGuilds.length === 1 && 'col-span-full'}`}>
                    {guild.icon ? (
                        <Image src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={`${guild.name} Icon`} className='h-16 w-16 rounded' width={100} height={100} />
                    ) : (
                        <div className='h-16 w-16 flex items-center justify-center'>
                            <span className='text-4xl'>{guild.name.charAt(0)}</span>
                        </div>
                    )}
                    <span className='text-lg'>{guild.name}</span>
                </Link>
            ))}
        </div>
    );
};