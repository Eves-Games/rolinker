import { auth } from "@/auth";
import { getBotGuild, getUserGuild, getUserGuilds } from "@/lib/guilds";
import { PlusIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { APIGuild } from "discord-api-types/v10";
import Link from "next/link";
import { Options } from "../_components/Options";
import { Guild } from "../_components/Guild";
import db from "@/lib/db";
import { GroupBasicResponse, GroupMembershipResponse } from "roblox-api-types";

export const runtime = "edge";

export default async function Page({ params }: { params: { id: string } }) {
    const session = await auth();

    const userGuild: APIGuild | null = await getUserGuild(params.id, session?.user.access_token);

    if (!userGuild || !userGuild.owner) {
        return (
            <Guild guild={false}>
                <ExclamationTriangleIcon className="h-16 w-6" />You do not have permission to view this guild.
            </Guild>
        )
    };

    const botGuild: APIGuild | null = await getBotGuild(params.id);

    const accounts = await db.account.findMany({
        where: {
            ownerId: session?.user.id
        }
    });

    const ids = accounts.map(account => account.id);

    const ownedGroups: GroupBasicResponse[] = [];
    for (const id of ids) {
        const groupsResponse = await fetch(`https://groups.roblox.com/v2/users/${id}/groups/roles`);
        const groupsData = await groupsResponse.json();
        const userOwnedGroups: GroupMembershipResponse[] = groupsData.data.filter((group: GroupMembershipResponse) => group.role.rank === 255);
        const refinedGroups: GroupBasicResponse[] = userOwnedGroups.map(group => group.group);
        ownedGroups.push(...refinedGroups);
    };

    ownedGroups.unshift({
        id: 0,
        name: 'None',
        memberCount: 0,
        hasVerifiedBadge: false
    });

    const currentGuild = await db.guild.findUnique({
        where: {
            id: params.id
        }
    });

    const currentGroupId = currentGuild ? (currentGuild.groupId ? parseInt(currentGuild.groupId) : 0) : 0

    return (
        <div className='flex-col space-y-2 w-full'>
            {!botGuild ? (
                <>
                    <Guild guild={userGuild}>
                        <ExclamationTriangleIcon className="h-16 w-6" />RoLinker bot is not a member of this guild.
                    </Guild>
                    <Link className="px-4 py-2 w-full flex justify-center items-center gap-4 hover:bg-neutral-700 bg-neutral-800 rounded shadow-lg" href={`https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id=990855457885278208&permissions=8&guild_id=${params.id}&disable_guild_select=true&redirect_uri=https://rolinker.net/api/auth/guild&response_type=code`}>
                        Add RoLinker<PlusIcon className="h-16 w-6" />
                    </Link>
                </>
            ) : (
                <>
                    <Guild guild={botGuild} />
                    <Options id={params.id} currentGroupId={currentGroupId} groups={ownedGroups} />
                </>
            )}
        </div>
    )
}