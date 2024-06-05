import Link from "next/link";
import Image from "next/image";
import RoLinker from "@/components/RoLinker.svg";
import { auth, signIn } from "@/auth";
import { Book, Command, Menu, Settings, Sliders } from "lucide-react";
import { ReactNode } from "react";
import { NavUser } from "@/components/NavUser";
import DiscordLogo from "@/components/DiscordLogo";

export interface LinkHref {
  name: string;
  href: string;
  icon: ReactNode;
}

export const NavLinks = [
  { name: "Commands", href: "/commands", icon: <Command className="size-5" /> },
  {
    name: "Documentation",
    href: "https://docs.rolinker.net",
    icon: <Book className="size-5" />,
  },
  {
    name: "Discord",
    href: "https://discord.gg/CJDuGzwFX4",
    icon: <DiscordLogo className="size-5 fill-white" />,
  },
] satisfies Array<LinkHref>;

export const UserLinks = [
  {
    name: "Manage",
    href: "/manage/accounts",
    icon: <Sliders className="size-5" />,
  },
  {
    name: "Settings",
    href: "/settings/account",
    icon: <Settings className="size-5" />,
  },
] satisfies Array<LinkHref>;

async function handleSignIn() {
  "use server";

  await signIn("discord");
}

export default async function Nav() {
  const session = await auth();

  return (
    <nav className="container navbar max-w-screen-lg">
      <ul className="menu navbar-start menu-horizontal flex-nowrap items-center gap-2 py-0">
        <div className="dropdown-start dropdown md:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <Menu className="size-5" />
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-200 p-2 shadow"
          >
            {NavLinks.map((LinkHref) => (
              <li key={LinkHref.name}>
                <Link href={LinkHref.href} className="justify-between">
                  {LinkHref.name}
                  {LinkHref.icon}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost">
          <Image
            src={RoLinker}
            alt="RoLinker Logo"
            className="size-6"
            width={100}
            height={100}
          />
          <h1 className="text-xl font-black">RoLinker</h1>
        </Link>
        {NavLinks.map((LinkHref) => (
          <li key={LinkHref.name} className="hidden md:block">
            <Link href={LinkHref.href}>{LinkHref.name}</Link>
          </li>
        ))}
      </ul>
      <div className="navbar-end">
        {session?.user ? (
          <NavUser userLinks={UserLinks} {...session.user} />
        ) : (
          <form action={handleSignIn}>
            <button className="btn btn-ghost">
              Sign in
              <DiscordLogo className="size-5" />
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}
