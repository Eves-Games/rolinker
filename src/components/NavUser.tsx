"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { LinkHref } from "./Nav";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface NavUserProps {
  userLinks: LinkHref[];
  name: string;
  image: string;
}

export function NavUser({ userLinks, name, image }: NavUserProps) {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="avatar btn btn-ghost">
        <h2 className="font-semibold">{name}</h2>
        <div className="w-10 rounded-full">
          <Image alt="Avatar" src={image} width={48} height={48} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-200 shadow"
      >
        {userLinks.map((LinkHref) => (
          <li key={LinkHref.name}>
            <Link href={LinkHref.href} className="justify-between">
              {LinkHref.name}
              {LinkHref.icon}
            </Link>
          </li>
        ))}
        <li>
          <button onClick={() => signOut({redirect: true, callbackUrl: "/"})} className="justify-between">
            Log out
            <LogOut className="size-5" />
          </button>
        </li>
      </ul>
    </div>
  );
}
