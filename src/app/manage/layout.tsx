import { UsersRound, Database, Code2 } from "lucide-react";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="container max-w-screen-lg space-y-4">
      <div className="prose">
        <h1>Manage</h1>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-fit space-y-2">
          <ul className="menu menu-sm rounded-box bg-base-200 shadow">
            <li>
              <Link href="/manage/accounts">
                <UsersRound className="size-5" />
                Accounts
              </Link>
            </li>
            <li>
              <Link href="/manage/servers">
                <Database className="size-5" />
                Servers
              </Link>
            </li>
          </ul>
          <ul className="menu menu-sm rounded-box bg-base-200 shadow">
            <li>
              <Link href="/manage/api-key">
                <Code2 className="size-5" />
                API Key
              </Link>
            </li>
          </ul>
        </div>
        {children}
      </div>
    </section>
  );
}
