import Image from "next/image";
import Link from "next/link";
import RoLinker from "@/components/RoLinker.svg";
import db from "@/db";
import { CheckCircle, Code2, Globe, Info, Users } from "lucide-react";
import DiscordLogo from "@/components/DiscordLogo";
import { Suspense } from "react";

export const revalidate = 86400;

async function Stats() {
  const guildsCount = await db.guild.count();
  const usersCount = await db.account.count();

  return (
    <>
      <div className="stat p-0">
        <div className="stat-title text-white">Total Servers</div>
        <div className="stat-value">{guildsCount}</div>
      </div>
      <div className="stat p-0">
        <div className="stat-title text-white">Total Users</div>
        <div className="stat-value">{usersCount}</div>
      </div>
    </>
  );
}

export default function Page() {
  return (
    <div className="space-y-12">
      <section className="hero bg-gradient-to-r from-red-800 to-[#E12626] py-12 shadow">
        <div className="hero-content grid w-full max-w-screen-lg grid-cols-1 justify-between gap-12 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h1 className="mb-4 text-6xl font-black">
              <Image
                src={RoLinker}
                alt="RoLinker Logo"
                className="inline-block size-16"
                width={100}
                height={100}
              />{" "}
              RoLinker
            </h1>
            <h2 className="text-2xl font-semibold">
              Connecting Roblox to Discord
            </h2>
            <div className="flex justify-center md:justify-start">
              <ul className="w-min list-inside list-disc text-nowrap py-4 text-left">
                <li>Rank Bot</li>
                <li>Divisions</li>
                <li>Web-Management</li>
                <li>Developer API</li>
              </ul>
            </div>
            <Link
              href="https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id=990855457885278208&permissions=8&redirect_uri=https://rolinker.net/api/auth/guild&response_type=code"
              className="btn btn-outline"
            >
              Add RoLinker
            </Link>
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-4xl font-bold">What we&#39;re linking</h2>
            <Suspense
              fallback={
                <>
                  <div className="stat p-0">
                    <div className="stat-title text-white">Total Servers</div>
                    <div className="stat-value">...</div>
                  </div>
                  <div className="stat p-0">
                    <div className="stat-title text-white">Total Users</div>
                    <div className="stat-value">...</div>
                  </div>
                </>
              }
            >
              <Stats />
            </Suspense>
          </div>
        </div>
      </section>
      <section className="container mx-auto max-w-screen-lg space-y-4">
        <h1 className="text-5xl font-bold">Why RoLinker?</h1>
        <h2 className="text-2xl font-medium">
          Featureful and Easy <CheckCircle className="inline-block size-6" />
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="card bg-base-200 shadow">
            <div className="card-body">
              <h2 className="card-title">
                <Users className="size-6" />
                Group Focused
              </h2>
              <p>
                RoLinker is designed for group owners, with features like server
                divisions, generate roles, and multi-account group linking.
              </p>
            </div>
          </div>
          <div className="card bg-base-200 shadow">
            <div className="card-body">
              <h2 className="card-title">
                <Code2 className="size-6" />
                Developer API
              </h2>
              <p>
                RoLinker is equipped with a rich API which can enable smart
                projects like auto-role bots and more.
              </p>
            </div>
          </div>
          <div className="card bg-base-200 shadow">
            <div className="card-body">
              <h2 className="card-title">
                <Globe className="size-6" />
                Fast Performance
              </h2>
              <p>
                RoLinker is deployed to the edge, making running commands and
                web management quick from wherever you are in the world.
              </p>
            </div>
          </div>
          <div className="card bg-base-200 shadow">
            <div className="card-body">
              <h2 className="card-title">
                <Info className="size-6" />
                Quick Support
              </h2>
              <p>
                RoLinker has a 24/7 support team and rich community involvement
                in improving the service - From bug hunts, to partnerships.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="hero bg-gradient-to-r from-[#5865F2] to-indigo-700 py-12 shadow">
        <div className="hero-content flex flex-col text-center">
          <h1 className="text-5xl font-black">
            <DiscordLogo className="inline-block size-14 fill-white" /> Join our
            Discord Server!
          </h1>
          <Link
            href="https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id=990855457885278208&permissions=8&redirect_uri=https://rolinker.net/api/auth/guild&response_type=code"
            className="btn btn-outline"
          >
            Join RoLinker Discord
          </Link>
        </div>
      </section>
      <section className="container mx-auto max-w-screen-lg space-y-4">
        <h1 className="text-5xl font-bold">Common Questions</h1>
        <div className="collapse collapse-arrow bg-base-200 shadow">
          <input type="radio" name="my-accordion-2" defaultChecked />
          <div className="collapse-title text-xl font-medium">
            How do I get started?
          </div>
          <div className="collapse-content">
            <p>
              Easy! First,{" "}
              <Link
                href="https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id=990855457885278208&permissions=8&redirect_uri=https://rolinker.net/api/auth/guild&response_type=code"
                className="link link-primary"
              >
                install the bot
              </Link>{" "}
              and it will automatically redirect you to the server management
              page.
            </p>
          </div>
        </div>
        <div className="collapse collapse-arrow bg-base-200 shadow">
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title text-xl font-medium">
            How do I set up the rank bot?
          </div>
          <div className="collapse-content">
            <ol className="list-inside list-decimal">
              <li>
                Go to{" "}
                <Link href="/manage/guilds" className="link link-primary">
                  manage guilds
                </Link>{" "}
                and select the server you want to enable the rank bot on.
              </li>
              <li>
                Get the cookie of the account you want to use for your rank bot.
                Follow{" "}
                <Link
                  href="https://docs.rolinker.net/tutorials/rank-bot-set-up"
                  className="link link-primary"
                >
                  this tutorial
                </Link>{" "}
                to get a valid cookie.
              </li>
              <li>Enter the valid cookie, and click submit cookie.</li>
            </ol>
            <p>Done! Now you can access commands like /bot promote and more.</p>
          </div>
        </div>
        <div className="collapse collapse-arrow bg-base-200 shadow">
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title text-xl font-medium">
            How do I use RoLinker API?
          </div>
          <div className="collapse-content">
            <p>
              Check out the{" "}
              <Link
                href="https://docs.rolinker.net"
                className="link link-primary"
              >
                documentation website
              </Link>{" "}
              for a list of API routes and examples.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
