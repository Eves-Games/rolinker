import { auth } from "@/auth";
import db from "@/db";
import { createUserRest } from "@/discord/rest";
import clsx from "clsx";
import {
  RESTGetAPICurrentUserGuildsResult,
  Routes,
} from "discord-api-types/v10";
import { AlertTriangle, Pencil } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Manage Servers",
};

export default async function Page() {
  const session = await auth();

  if (!session || !session.user)
    throw new Error("Could not get session! Try signing in!");

  const userRest = createUserRest(session.user.access_token);
  const guilds = (await userRest.get(
    Routes.userGuilds(),
  )) as RESTGetAPICurrentUserGuildsResult;
  const ownedGuilds = guilds.filter((guild) => guild.owner === true);

  if (ownedGuilds.length === 0) {
    return (
      <section className="w-full">
        <div role="alert" className="alert shadow">
          <AlertTriangle className="size-6" />
          <span className="text-lg">You own no guilds!</span>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full space-y-2">
      {ownedGuilds.map((guild) => (
        <div role="alert" className="alert shadow" key={guild.id}>
          <div className={clsx("avatar", !guild.icon && "placeholder")}>
            {guild.icon ? (
              <div className="size-16 rounded-box">
                <Image
                  src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                  alt={`${guild.name} Icon`}
                  width={100}
                  height={100}
                />
              </div>
            ) : (
              <div className="size-16 rounded-box bg-neutral text-neutral-content">
                <span className="text-xl">{guild.name.charAt(0)}</span>
              </div>
            )}
          </div>
          <span className="text-lg">{guild.name}</span>
          <Link
            href={`/manage/servers/${guild.id}`}
            className="btn btn-square btn-ghost"
          >
            <Pencil className="size-5" />
          </Link>
        </div>
      ))}
    </section>
  );
}
