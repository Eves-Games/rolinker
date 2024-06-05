import Link from "next/link";
import { Code2, Database, UsersRound } from "lucide-react";

export async function Manage() {
  return (
    <div className="w-fit space-y-2">
      <ul className="menu rounded-box bg-base-200">
        <li>
          <Link href="/accounts">
            <UsersRound className="size-5" />
            Accounts
          </Link>
        </li>
        <li>
          <Link href="/servers">
            <Database className="size-5" />
            Servers
          </Link>
        </li>
      </ul>
      <ul className="menu rounded-box bg-base-200">
        <li>
          <Link href="/api">
            <Code2 className="size-5" />
            API Key
          </Link>
        </li>
      </ul>
    </div>
  );
}
