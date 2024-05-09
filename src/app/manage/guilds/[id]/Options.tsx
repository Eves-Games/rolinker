'use client';
import { useEffect, useMemo, useState } from "react";
import { GroupBasicResponse } from "roblox-api-types";
import GroupList from "./_components/GroupList";
import ParentList from "./_components/ParentList"
import ChannelList from "./_components/ChannelList"
import { ArrowPathIcon, CheckIcon, FlagIcon, UserGroupIcon, WrenchScrewdriverIcon, ArrowTopRightOnSquareIcon, PaperAirplaneIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { genDiscordRoles, performSave } from "./actions";
import { APITextChannel } from "discord-api-types/v10";
import { APIGuild } from "./page";
import Link from "next/link";

export default function Options({
    guildId,
    groups,
    guilds,
    channels
}: {
    guildId: string
    groups: {
        currentGroupId: string | null
        userGroups: GroupBasicResponse[]
    },
    guilds: {
        currentParentId: string | null
        userGuilds: APIGuild[]
    },
    channels: {
        currentChannelId: string | null
        guildChannels: APITextChannel[]
    }
}) {
    const [submission, setSubmission] = useState({
        group: {
            currentId: groups.currentGroupId,
            newId: groups.currentGroupId,
        },
        parent: {
            currentId: guilds.currentParentId,
            newId: guilds.currentParentId,
        },
        channel: {
            currentId: channels.currentChannelId,
            newId: channels.currentChannelId,
        },
    });

    const currentGroup = groups.userGroups.find(group => group.id.toString() === submission.group.newId) || null;
    const currentParent = guilds.userGuilds.find(guild => guild.id === submission.parent.newId) || null;
    const currentChannel = channels.guildChannels.find(channel => channel.id === submission.channel.newId) || null;

    const handleGroupChange = (group: GroupBasicResponse | null) => {
        setSubmission((prevSubmission) => ({ ...prevSubmission, group: { ...prevSubmission.group, newId: group?.id.toString() || null } }));
    };

    const handleParentChange = (parent: APIGuild | null) => {
        setSubmission((prevSubmission) => ({ ...prevSubmission, parent: { ...prevSubmission.parent, newId: parent?.id || null, }, }));
    };

    const handleChannelChange = (channel: APITextChannel | null) => {
        setSubmission((prevSubmission) => ({ ...prevSubmission, channel: { ...prevSubmission.channel, newId: channel?.id || null, }, }));
    };

    const canSubmit = useMemo(() => {
        return (
            submission.group.currentId !== submission.group.newId ||
            submission.parent.currentId !== submission.parent.newId ||
            submission.channel.currentId !== submission.channel.newId
        );
    }, [submission]);

    const handleSaveChanges = async () => {
        await performSave(guildId, submission);
        setSubmission({
            group: { ...submission.group, currentId: submission.group.newId },
            parent: { ...submission.parent, currentId: submission.parent.newId },
            channel: { ...submission.channel, currentId: submission.channel.newId },
        })
    };

    return (
        <>
            <div className='bg-neutral-800 rounded shadow-lg w-full px-4 py-2 space-y-2'>
                <div className='flex items-center space-x-4 mb-4'>
                    <UserGroupIcon className='size-6' />
                    <span>Group Options</span>
                </div>
                <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
                    <div className='space-y-2 relative'>
                        <span>Roblox Group</span>
                        <GroupList
                            groups={groups.userGroups}
                            selectedGroup={currentGroup}
                            onChange={handleGroupChange}
                        />
                    </div>
                    <div className='space-y-2'>
                        <span>Discord Roles</span>
                        <form action={() => { genDiscordRoles(guildId); }}>
                            <button className='flex justify-between space-x-4 w-full bg-neutral-700 hover:bg-neutral-600 rounded-lg py-2 px-4 shadow-lg'>
                                <span className='truncate'>Generate Discord Roles</span>
                                <ArrowPathIcon className='size-6 flex-shrink-0' aria-hidden='true' />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className='bg-neutral-800 rounded shadow-lg w-full px-4 py-2 space-y-2'>
                <div className='flex items-center space-x-4 mb-4'>
                    <FlagIcon className='size-6' />
                    <span>Affiliation Options</span>
                </div>
                <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
                    <div className='space-y-2 relative'>
                        <span>Parent Guild</span>
                        <ParentList
                            guilds={guilds.userGuilds}
                            selectedParent={currentParent}
                            onChange={handleParentChange}
                        />
                    </div>
                    <div className='space-y-2 relative'>
                        <span>Invite Channel</span>
                        <ChannelList
                            channels={channels.guildChannels}
                            selectedChannel={currentChannel}
                            onChange={handleChannelChange}
                        />
                    </div>
                </div>
            </div>
            <div className='bg-neutral-800 rounded shadow-lg w-full py-2 px-4 space-y-2'>
                <div className='flex items-center space-x-4 mb-4'>
                    <WrenchScrewdriverIcon className='size-6' />
                    <span>Rank Bot Options</span>
                </div>
                <p>Security Cookie</p>
                <form className='flex space-x-2'>
                    <input type="text" placeholder="Enter Bot Cookie" className='flex justify-between space-x-4 w-full bg-neutral-700 hover:bg-neutral-600 rounded-lg py-2 px-4 shadow-lg' />
                    <button className='flex justify-between space-x-4 bg-indigo-700 hover:bg-indigo-600 rounded-lg py-2 px-4 shadow-lg'>
                        <span className='truncate'>Submit Cookie</span>
                        <PaperAirplaneIcon className='size-6 flex-shrink-0' aria-hidden='true' />
                    </button>
                </form>
                <p className='text-center'>This feature is not working right now <ExclamationTriangleIcon className="size-5 inline-block" /></p>
                <p className='text-center'><Link href='/terms-of-service' className='text-blue-500 hover:underline' target='_blank'>Terms of Service <ArrowTopRightOnSquareIcon className="size-5 inline-block" /></Link></p>
            </div>
            <form action={handleSaveChanges}>
                <button className={`flex justify-between space-x-4 bg-green-700 py-2 px-4 rounded ${canSubmit ? 'hover:bg-green-600' : 'opacity-50 cursor-not-allowed'}`} disabled={!canSubmit}>
                    <span className='truncate'>Save Changes</span>
                    <CheckIcon className='size-6 flex-shrink-0' aria-hidden='true' />
                </button>
            </form>
        </>
    );
}