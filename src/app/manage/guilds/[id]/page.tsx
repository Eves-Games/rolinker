import { auth } from "@/auth";
import { ArrowPathIcon, ArrowTopRightOnSquareIcon, ExclamationTriangleIcon, FlagIcon, PaperAirplaneIcon, PlusIcon, UserGroupIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { APIGuild, RESTGetAPICurrentUserGuildsResult, RESTGetAPIGuildChannelsResult, Routes } from "discord-api-types/v10";
import { createUserRest, rest } from "@/lib/discord/rest";
import db from "@/lib/db";
import Link from "next/link";
import { SubmissionContextProvider } from "./_contexts/SubmissionContext";
import { getUserRoles } from "@/lib/roblox";
import SelectList from "./_components/SelectList";
import { genDiscordRoles, submitCookie } from "./actions";

export const runtime = "edge";

export default async function Page({ params }: { params: { id: string } }) {
    const session = await auth();

    const botGuild = await rest.get(Routes.guild(params.id)).catch(() => null) as APIGuild | null;

    if (!botGuild) {
        return (
            <Link href={`https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id=990855457885278208&permissions=8&guild_id=${params.id}&disable_guild_select=true&redirect_uri=https://rolinker.net/api/auth/guild&response_type=code`} className="flex justify-center items-center space-x-4 border-dashed border-4 border-neutral-800 hover:bg-neutral-700 rounded shadow-lg w-full h-20">
                <PlusIcon className="size-6" />
                <span>Add Guild</span>
            </Link>
        );
    };

    const guild = await db.guild.findUnique({ where: { id: botGuild.id } }) ?? await db.guild.create({ data: { id: botGuild.id } });
    const accountIds = (await db.account.findMany({ where: { userId: session!.user.id } })).map(account => account.id);
    const userRest = createUserRest(session!.user.access_token);

    const textChannels = (await rest.get(Routes.guildChannels(guild.id)) as RESTGetAPIGuildChannelsResult).filter(channel => channel.type === 0);
    const guilds = await userRest.get(Routes.userGuilds()) as RESTGetAPICurrentUserGuildsResult;
    const groups = (await Promise.all(accountIds.map(async (id) => {
        try {
            const groupMemberships = await getUserRoles(id);
            return groupMemberships.data.map(group => group.group);
        } catch {
            return []
        }
    }))).flat();

    const genDiscordRolesWithId = genDiscordRoles.bind(null, botGuild.id)
    const submitCookieWithId = submitCookie.bind(null, botGuild.id)

    return (
        <div className="w-full space-y-2">
            <div className="flex items-center space-x-4 bg-neutral-800 px-4 py-2 rounded shadow-lg w-full" key={guild.id}>
                {botGuild.icon ? (
                    <Image src={`https://cdn.discordapp.com/icons/${botGuild.id}/${botGuild.icon}.png`} alt={`${botGuild.name} Icon`} className="size-16 rounded" width={100} height={100} />
                ) : (
                    <div className="size-16 flex items-center justify-center">
                        <span className="text-4xl">{botGuild.name.charAt(0)}</span>
                    </div>
                )}
                <span className="text-lg">{botGuild.name}</span>
            </div>
            <SubmissionContextProvider guild={guild} >
                <div className="bg-neutral-800 rounded shadow-lg w-full px-4 py-2 space-y-2">
                    <div className="flex items-center space-x-4 mb-4">
                        <UserGroupIcon className="size-6" />
                        <span>Group Options</span>
                    </div>
                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                        <div className="space-y-2 relative">
                            <span>Roblox Group</span>
                            <SelectList type="Group" data={groups} />
                        </div>
                        <div className="space-y-2">
                            <span>Discord Roles</span>
                            <button formAction={genDiscordRolesWithId} className="flex justify-between space-x-4 w-full bg-neutral-700 hover:bg-neutral-600 rounded-lg py-2 px-4 shadow-lg">
                                <span className="truncate">Generate Discord Roles</span>
                                <ArrowPathIcon className="size-6 flex-shrink-0" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-neutral-800 rounded shadow-lg w-full px-4 py-2 space-y-2">
                    <div className="flex items-center space-x-4 mb-4">
                        <FlagIcon className="size-6" />
                        <span>Affiliation Options</span>
                    </div>
                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                        <div className="space-y-2 relative">
                            <span>Parent Guild</span>
                            <SelectList type="Parent" data={guilds} />
                        </div>
                        <div className="space-y-2 relative">
                            <span>Invite Channel</span>
                            <SelectList type="Channel" data={textChannels} />
                        </div>
                    </div>
                </div>
                <div className="bg-neutral-800 rounded shadow-lg w-full py-2 px-4 space-y-2">
                    <div className="flex items-center space-x-4 mb-4">
                        <WrenchScrewdriverIcon className="size-6" />
                        <span>Rank Bot Options</span>
                    </div>
                    <p>Security Cookie</p>
                    <form action={submitCookieWithId} className="flex space-x-2">
                        <input name="cookie" type="text" placeholder="Enter Bot Cookie" className="flex justify-between space-x-4 w-full bg-neutral-700 hover:bg-neutral-600 rounded-lg py-2 px-4 shadow-lg" />
                        <button className="flex justify-between space-x-4 bg-indigo-700 hover:bg-indigo-600 rounded-lg py-2 px-4 shadow-lg">
                            <span className="truncate">Submit Cookie</span>
                            <PaperAirplaneIcon className="size-6 flex-shrink-0" aria-hidden="true" />
                        </button>
                    </form>
                    <p className="text-center">This feature will be available on the 12th <ExclamationTriangleIcon className="size-5 inline-block" /></p>
                    <p className="text-center"><Link href="/terms-of-service" className="text-blue-500 hover:underline" target="_blank">Terms of Service <ArrowTopRightOnSquareIcon className="size-5 inline-block" /></Link></p>
                </div>
            </SubmissionContextProvider>
        </div>
    );
};