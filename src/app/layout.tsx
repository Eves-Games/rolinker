import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer"
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
        <body className={`${open_sans.className} bg-neutral-900 text-neutral-100 tracking-wide overflow-y-auto`}>
          <Nav />
          <hr className='border-neutral-800' />
          <div className='min-h-screen py-4'>{children}</div>
          <hr className='border-neutral-800' />
          <Footer />
        </body>
      </html>
    </SessionProvider>
  );
}
