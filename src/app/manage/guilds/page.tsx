import { APIGuild } from "discord-api-types/v10"
import Image from 'next/image';
import { auth } from "@/auth";
import { redirect } from 'next/navigation';

export const runtime = "edge";

async function checkGuild(guild: APIGuild) {
    const guildRes = await fetch(`https://discord.com/api/v10/guilds/${guild.id}/preview`, {
        headers: {
            Authorization: 'Bot ' + process.env.DISCORD_BOT_TOKEN,
        }
    });

    if (!guildRes.ok) {
        redirect(`https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id=990855457885278208&permissions=8&guild_id=${guild.id}&disable_guild_select=true&redirect_uri=https://rolinker.net/api/auth/guild&response_type=code`)
    };

    redirect(`/manage/guilds/${guild.id}`)
}

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

    return (
        <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-2 w-full'>
            {ownedGuilds.length !== 0 && ownedGuilds.map((guild) => (
                <form key={guild.id} className={`${ownedGuilds.length === 1 && 'col-span-full'}`} action={async () => {
                    'use server';

                    await checkGuild(guild);
                }}>
                    <button className={`flex items-center space-x-4 bg-neutral-800 w-full px-4 py-2 rounded shadow-lg hover:bg-neutral-700`}>
                        {guild.icon ? (
                            <Image src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={`${guild.name} Icon`} className='h-16 w-16 rounded' width={100} height={100} />
                        ) : (
                            <div className='h-16 w-16 flex items-center justify-center'>
                                <span className='text-4xl'>{guild.name.charAt(0)}</span>
                            </div>
                        )}
                        <span className='text-lg'>{guild.name}</span>
                    </button>
                </form>
            ))}
        </div>
    );
};