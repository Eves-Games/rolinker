"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import { Guild } from "@prisma/client/edge";
import { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from "react";
import { performSave } from "../actions";

type SubmissionContextProviderProps = {
    guild: Guild;
    children: React.ReactNode;
};

type SubmissionContext = {
    submission: Guild;
    setSubmission: Dispatch<SetStateAction<Guild>>;
};

const SubmissionContext = createContext<SubmissionContext | null>(null);

export function SubmissionContextProvider({ guild, children }: SubmissionContextProviderProps) {
    const [origin, setOrigin] = useState(guild);
    const [submission, setSubmission] = useState(guild);

    const canSubmit = useMemo(() => {
        return (
            submission.groupId !== origin.groupId ||
            submission.inviteChannelId !== origin.inviteChannelId ||
            submission.parentGuildId !== origin.parentGuildId
        );
    }, [submission, origin]);

    const handleSaveChanges = async () => {
        if (canSubmit) {
            await performSave(submission);
            setOrigin({ ...submission });
        };
    };

    return (
        <SubmissionContext.Provider
            value={{
                submission,
                setSubmission
            }}
        >
            {children}
            <form action={handleSaveChanges}>
                <button className={`flex justify-between space-x-4 bg-green-700 py-2 px-4 rounded ${canSubmit ? "hover:bg-green-600" : "opacity-50 cursor-not-allowed"}`} disabled={!canSubmit}>
                    <span className="truncate">Save Changes</span>
                    <CheckIcon className="size-6 flex-shrink-0" aria-hidden="true" />
                </button>
            </form>
        </SubmissionContext.Provider>
    );
};

export function useSubmissionContext() {
    const context = useContext(SubmissionContext);

    if (!context) {
        throw new Error("useSubmissionContext must be used within a SubmissionContextProvider");
    };

    return context;
};