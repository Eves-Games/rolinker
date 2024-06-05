import { Wallet, User } from "lucide-react";
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
      <div className="flex gap-4">
          <ul className="menu menu-sm rounded-box bg-base-200 shadow h-min">
            <li>
              <Link href="/settings/account">
                <User className="size-5" />
                Account
              </Link>
            </li>
            <li>
              <Link href="/settings/billing">
                <Wallet className="size-5" />
                Billing
              </Link>
            </li>
          </ul>
        {children}
      </div>
    </section>
  );
}
