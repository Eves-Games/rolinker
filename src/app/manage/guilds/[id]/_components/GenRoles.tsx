"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { genDiscordRoles } from "../actions";
import { useSubmissionContext } from "../_contexts/SubmissionContext";

export default function GenRoles() {
    const { submission, setSubmission } = useSubmissionContext();
    
    return (
        <button onClick={async () => {
            await genDiscordRoles(submission.id);
        }} className="flex justify-between space-x-4 w-full bg-neutral-700 hover:bg-neutral-600 rounded-lg py-2 px-4 shadow-lg">
            <span className="truncate">Generate Discord Roles</span>
            <ArrowPathIcon className="size-6 flex-shrink-0" aria-hidden="true" />
        </button>
    )
}