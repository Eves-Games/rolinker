import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Nav from "./components/Nav";
import { auth } from "@/auth";

const open_sans = Open_Sans({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "RoLinker",
  description: "Access your Roblox accounts on Discord",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${open_sans.className} bg-neutral-900 text-neutral-100 container tracking-wide`}>
          <Nav />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
