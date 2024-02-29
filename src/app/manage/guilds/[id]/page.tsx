import { auth } from "@/auth";
import { getBotGuild } from "@/lib/guilds";
import { APIGuild } from "discord-api-types/v10";

export const runtime = "edge";

export default async function Page({ params }: { params: { id: string } }) {
    const session = await auth();

    const guild: APIGuild = await getBotGuild(params.id);

    if (guild.owner_id !== session?.user.id) {
        return (
            <div>No permission</div>
        )
    };

    return (
        <div className='flex-col space-y-2 w-full'>
            <div>{guild.name}</div>
        </div>
    )
}