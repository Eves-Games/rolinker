import { APIGuild } from "discord-api-types/v10"
import Image from 'next/image';
import { auth } from "@/auth";
import { redirect } from 'next/navigation';
import { getBotGuild, getUserGuilds } from "@/lib/guilds";

export const runtime = "edge";

async function checkGuild(id: string) {
    const targetGuild: APIGuild = await getBotGuild(id);

    if (!targetGuild) {
        redirect(`https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id=990855457885278208&permissions=8&guild_id=${id}&disable_guild_select=true&redirect_uri=https://rolinker.net/api/auth/guild&response_type=code`);
    } else {
        redirect(`/manage/guilds/${id}`);
    };
}

export default async function Page() {
    const session = await auth();

    const guilds: Array<APIGuild> = await getUserGuilds(session?.user.access_token);
    const ownedGuilds: Array<APIGuild> = guilds.filter(guild => guild.owner === true);

    return (
        <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-2 w-full'>
            {ownedGuilds.length !== 0 && ownedGuilds.map((guild) => (
                <form key={guild.id} className={`${ownedGuilds.length === 1 && 'col-span-full'}`} action={async () => {'use server'; await checkGuild(guild.id);}}>
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