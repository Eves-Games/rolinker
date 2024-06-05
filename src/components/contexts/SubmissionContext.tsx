"use client";

import { performSave } from "@/app/manage/servers/[id]/actions";
import { Guild } from "@prisma/client/edge";
import { Check } from "lucide-react";
import { createContext, Dispatch, FormEvent, SetStateAction, useContext, useMemo, useState } from "react";

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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [origin, setOrigin] = useState(guild);
    const [submission, setSubmission] = useState(guild);

    const canSubmit = useMemo(() => {
        return (
            submission.groupId !== origin.groupId ||
            submission.inviteChannelId !== origin.inviteChannelId ||
            submission.parentGuildId !== origin.parentGuildId ||
            submission.robloxCookie !== origin.robloxCookie ||
            submission.verifiedRoleId !== origin.verifiedRoleId
        );
    }, [submission, origin]);


    const handleSaveChanges = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (canSubmit) {
            setIsLoading(true);

            try {
                await performSave(submission);
                setOrigin({ ...submission });
            } finally {
                setIsLoading(false);
            };
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
            <form onSubmit={handleSaveChanges}>
                <button className={"btn btn-primary"} disabled={!canSubmit}>
                    {isLoading ? <span className="loading loading-spinner size-5"></span> : <Check className="size-5" />}
                    Save Changes
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