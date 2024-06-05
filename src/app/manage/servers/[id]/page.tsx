import { auth } from "@/auth";
import { SubmissionContextProvider } from "@/components/contexts/SubmissionContext";
import db from "@/db";
import { createUserRest, rest } from "@/discord/rest";
import {
  APIGuild,
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPIGuildChannelsResult,
  RESTGetAPIGuildRolesResult,
  Routes,
} from "discord-api-types/v10";
import { genDiscordRoles } from "./actions";
import {
  AlertTriangle,
  Flag,
  RefreshCcw,
  Send,
  SquareArrowOutUpRight,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { getUserRoles } from "@/roblox";
import SelectList from "@/components/guild-options/SelectList";
import { Metadata } from "next";
import SubmitCookie from "@/components/guild-options/SubmitCookie";
import Card from "@/components/Card";
import GenerateRoles from "@/components/guild-options/GenerateRoles";

export const metadata: Metadata = {
  title: "Manage Server",
};

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user)
    throw new Error("Could not get session! Try signing in!");

  const botGuild = (await rest
    .get(Routes.guild(params.id))
    .catch(() => null)) as APIGuild | null;

  if (!botGuild) {
    return (
      <section className="w-full">
        <div role="alert" className="alert shadow">
          <AlertTriangle className="size-6" />
          <span className="text-lg">Cannot get guild!</span>
          <Link
            href="https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id=990855457885278208&permissions=8&redirect_uri=https://rolinker.net/api/auth/guild&response_type=code"
            className="btn btn-ghost btn-sm"
          >
            <Send className="size-5" />
            Add RoLinker
          </Link>
        </div>
      </section>
    );
  } else if (botGuild.owner_id !== session.user.id) {
    return (
      <section className="w-full">
        <div role="alert" className="alert shadow">
          <AlertTriangle className="size-6" />
          <span className="text-lg">Unauthorized!</span>
        </div>
      </section>
    );
  }

  const guild =
    (await db.guild.findUnique({ where: { id: botGuild.id } })) ??
    (await db.guild.create({ data: { id: botGuild.id } }));

  const accountIds = (
    await db.account.findMany({ where: { userId: session!.user.id } })
  ).map((account) => account.id);
  const userRest = createUserRest(session!.user.access_token);

  const textChannels = (
    (await rest.get(
      Routes.guildChannels(guild.id),
    )) as RESTGetAPIGuildChannelsResult
  ).filter((channel) => channel.type === 0);

  const roles = (
    (await rest.get(
      Routes.guildRoles(guild.id),
    )) as RESTGetAPIGuildRolesResult
  );

  const guilds = (
    (await userRest.get(
      Routes.userGuilds(),
    )) as RESTGetAPICurrentUserGuildsResult
  ).filter((guild) => guild.owner);

  const groups = (
    await Promise.all(
      accountIds.map(async (id) => {
        try {
          const groupMemberships = await getUserRoles(id);
          return groupMemberships.data
            .filter((groupMembership) => groupMembership.role.rank == 255)
            .map((group) => group.group);
        } catch {
          return [];
        }
      }),
    )
  ).flat();

  

  return (
    <section className="w-full space-y-2">
      <Card>
        <h2 className="card-title">
          <div className={clsx("avatar", !botGuild.icon && "placeholder")}>
            {botGuild.icon ? (
              <div className="size-6 rounded-full">
                <Image
                  src={`https://cdn.discordapp.com/icons/${botGuild.id}/${botGuild.icon}.png`}
                  alt={`${botGuild.name} Icon`}
                  width={100}
                  height={100}
                />
              </div>
            ) : (
              <div className="size-6 rounded-full bg-neutral text-neutral-content">
                <span className="text-xs">{botGuild.name.charAt(0)}</span>
              </div>
            )}
          </div>
          {botGuild.name}
        </h2>
      </Card>
      <SubmissionContextProvider guild={guild}>
        <Card>
          <h2 className="card-title">
            <Users className="size-6" />
            Group
          </h2>
          <div className="card-actions grid grid-cols-1 md:grid-cols-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Roblox Group</span>
              </div>
              <SelectList
                type="Group"
                data={groups}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Discord Roles</span>
              </div>
              <GenerateRoles guildId={botGuild.id} />
            </label>
            <label className="form-control w-full col-span-2">
              <div className="label">
                <span className="label-text">Verified Role</span>
              </div>
              <SelectList
                type="VerifiedRole"
                data={roles}
              />
            </label>
          </div>
        </Card>
        <Card>
          <h2 className="card-title">
            <Flag className="size-6" />
            Affiliations
          </h2>
          <div className="card-actions grid grid-cols-1 md:grid-cols-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Parent Server</span>
              </div>
              <SelectList
                type="Parent"
                data={guilds}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Invite Channel</span>
              </div>
              <SelectList
                type="Channel"
                data={textChannels}
              />
            </label>
          </div>
        </Card>
        <Card>
          <h2 className="card-title">
            <Wrench className="size-6" />
            Rank-Bot
          </h2>
          <div className="card-actions">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Bot Cookie</span>
              </div>
              <SubmitCookie />
            </label>
          </div>
          <Link
            href="https://docs.rolinker.net/tutorials/rank-bot-set-up"
            className="link link-primary"
          >
            Getting a valid cookie{" "}
            <SquareArrowOutUpRight className="inline-block size-5" />
          </Link>
        </Card>
      </SubmissionContextProvider>
    </section>
  );
}
