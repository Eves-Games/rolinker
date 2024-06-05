"use client";

import { genDiscordRoles } from "@/app/manage/servers/[id]/actions";
import { useSubmissionContext } from "@/components/contexts/SubmissionContext";
import clsx from "clsx";
import { RefreshCcw } from "lucide-react";

export default function GenerateRoles({guildId}: {guildId: string}) {
  const { submission, setSubmission } = useSubmissionContext();

  const genDiscordRolesWithId = genDiscordRoles.bind(null, guildId);

  return (
    <form action={genDiscordRolesWithId}>
      <button
        className={clsx(
          "btn btn-neutral w-full",
          !submission.groupId && "btn-disabled",
        )}
      >
        <RefreshCcw className="size-5" /> Generate Discord Roles
      </button>
    </form>
  );
}
