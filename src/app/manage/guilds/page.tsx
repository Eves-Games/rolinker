import { APIGuild } from "discord-api-types/v10"
import { auth } from "@/auth";
import { getUserGuilds } from "@/lib/guilds";
import { Guild } from "./_components/Guild";

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
                <Guild key={guild.id} href={`/manage/guilds/${guild.id}`} guild={guild} className={`${ownedGuilds.length === 1 && 'col-span-full'}`} />
            ))}
        </div>
    );
};