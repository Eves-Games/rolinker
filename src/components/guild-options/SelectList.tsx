"use client";

import { UserRolesGroup } from "@/roblox";
import { useSubmissionContext } from "@/components/contexts/SubmissionContext";
import {
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPIGuildChannelsResult,
  RESTGetAPIGuildRolesResult,
} from "discord-api-types/v10";

type SelectListProps = {
  type: "Group" | "Channel" | "Parent" | "VerifiedRole";
  data:
    | UserRolesGroup[]
    | RESTGetAPIGuildChannelsResult
    | RESTGetAPICurrentUserGuildsResult
    | RESTGetAPIGuildRolesResult;
};

export default function SelectList({ type, data }: SelectListProps) {
  const { submission, setSubmission } = useSubmissionContext();

  const currentEntry =
    data.find(
      (entry) =>
        entry.id.toString() == submission.groupId ||
        entry.id.toString() == submission.parentGuildId ||
        entry.id.toString() == submission.inviteChannelId ||
        entry.id.toString() == submission.verifiedRoleId,
    ) || null;
  const key =
    type === "Group"
      ? "groupId"
      : type === "Channel"
        ? "inviteChannelId"
        : type === "Parent"
          ? "parentGuildId"
          : type === "VerifiedRole"
            ? "verifiedRoleId"
            : null;

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedValue = event.target.value;

    if (key) {
      setSubmission((prevSubmission) => ({
        ...prevSubmission,
        [key]: selectedValue || null,
      }));
    }
  }

  return (
    <select
      className="select w-full"
      value={currentEntry?.id || ""}
      onChange={handleChange}
    >
      <option value="">None</option>
      {data.map((entry) => (
        <option key={entry.id} value={entry.id}>
          {entry.name}
        </option>
      ))}
    </select>
  );
}
