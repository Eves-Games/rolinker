import { auth } from "@/auth";
import { getGuild } from "@/lib/guilds";
import { PlusIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { APIGuild } from "discord-api-types/v10";
import { Options } from "../_components/Options";
import db from "@/lib/db";
import { GroupBasicResponse, GroupMembershipResponse } from "roblox-api-types";
import Block from "@/app/_components/Block";
import Image from "next/image";

export const runtime = "edge";

export default async function Page({ params }: { params: { id: string } }) {
    const session = await auth();

    const guildRes: { status: string; guild: APIGuild | null } = await getGuild(params.id);
    const guild = guildRes.guild;

    const guildContent = guild ? (
        <>
            {guild.icon ? (
                <Image src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={`${guild.name} Icon`} className='h-16 w-16 rounded' width={100} height={100} />
            ) : (
                <span className='h-16 w-16 flex items-center justify-center'>{guild.name.charAt(0)}</span>
            )
            }
            <span className='text-lg'>{guild.name}</span>
        </>
    ) : (
        <>
            <span className='h-16 w-16 flex items-center text-4xl justify-center'>N</span>
            <span className='text-lg'>Not Found</span>
        </>
    );

    if (guildRes.status == 'Unauthorized') {
        return (
            <>
                <Block className='flex space-x-4 justify-between items-center w-full'>
                    <div className='flex items-center space-x-4'>
                        <span className='h-16 w-16 flex items-center text-4xl justify-center'>U</span>
                        <span className='text-lg'>Unauthorized</span>
                    </div>
                    <div className='flex items-center space-x-4'>
                        <ExclamationTriangleIcon className="h-16 w-6" />
                        <span>You do not have permission to view this guild.</span>
                    </div>
                </Block>
            </>
        );
    } else if (guildRes.status == 'Not Found') {
        return (
            <>
                <div className='flex-col space-y-2 w-full'>
                    <Block className='flex space-x-4 justify-between items-center w-full'>
                        <div className='flex items-center space-x-4'>
                            {guildContent}
                        </div>
                        <div className='flex items-center space-x-4'>
                            <ExclamationTriangleIcon className="h-16 w-6" />
                            <span>RoLinker bot is not a member of this guild.</span>
                        </div>
                    </Block>
                    {guild && (
                        <Block className='flex space-x-4 justify-center items-center w-full' href={`https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id=990855457885278208&permissions=8&guild_id=${params.id}&disable_guild_select=true&redirect_uri=https://rolinker.net/api/auth/guild&response_type=code`}>
                            <span>Add RoLinker</span>
                            <PlusIcon className="h-16 w-6" />
                        </Block>
                    )
                    }
                </div>
            </>
        );
    };

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

    const currentGroupId = currentGuild ? (currentGuild.groupId ? parseInt(currentGuild.groupId) : 0) : 0;

    return (
        <div className='flex-col space-y-2 w-full'>
            <Block className='flex space-x-4 items-center'>
                {guildContent}
            </Block>
            <Options id={params.id} currentGroupId={currentGroupId} groups={ownedGroups} />
        </div>
    );
};