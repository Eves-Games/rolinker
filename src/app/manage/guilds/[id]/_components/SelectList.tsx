"use client";

import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { useSubmissionContext } from "../_contexts/SubmissionContext";
import { UserRolesGroup } from "@/lib/roblox";
import { APIChannel, RESTAPIPartialCurrentUserGuild, RESTGetAPICurrentUserGuildsResult, RESTGetAPIGuildChannelsResult } from "discord-api-types/v10";

type SelectListProps = {
    type: "Group" | "Channel" | "Parent";
    data: UserRolesGroup[] | RESTGetAPIGuildChannelsResult | RESTGetAPICurrentUserGuildsResult;
};

export default function SelectList({ type, data }: SelectListProps) {
    const { submission, setSubmission } = useSubmissionContext();

    const currentEntry = data.find(entry => entry.id.toString() == submission.groupId) || null;

    const handleChange = (entry: UserRolesGroup | APIChannel | RESTAPIPartialCurrentUserGuild | null) => {
        const key = type === "Group" ? "groupId" : type === "Channel" ? "inviteChannelId" : type === "Parent" ? "parentGuildId" : null;
      
        if (key) {
          setSubmission((prevSubmission) => ({
            ...prevSubmission,
            [key]: entry?.id.toString() || null,
          }));
        }
      };

    return (
        <Listbox value={currentEntry} onChange={handleChange}>
            <Listbox.Button className="space-x-4 w-full flex justify-between rounded-lg bg-neutral-700 hover:bg-neutral-600 py-2 px-4 shadow-lg">
                <span className="truncate">{currentEntry?.name || "None"}</span>
                <ChevronUpDownIcon className="size-6 flex-shrink-0" aria-hidden="true" />
            </Listbox.Button>
            <Listbox.Options className="absolute w-full mt-2 max-h-60 overflow-auto rounded-md bg-neutral-700 shadow-lg z-50">
                <Listbox.Option as="button" key="none" className="flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-600 rounded-lg" value={null}>
                    <span className="block truncate">None</span>
                    {!currentEntry && <CheckIcon className="size-6 flex-shrink-0" aria-hidden="true" />}
                </Listbox.Option>
                {data.map((entry, index) => (
                    <Listbox.Option as="button" key={index} className="flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-600 rounded-lg" value={entry}>
                        <span className="block truncate">{entry.name}</span>
                        {entry === currentEntry && <CheckIcon className="size-6 flex-shrink-0" aria-hidden="true" />}
                    </Listbox.Option>
                ))}
            </Listbox.Options>
        </Listbox>
    );
}