import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import Nav from "./components/Nav";

const open_sans = Open_Sans({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "RoLinker",
  description: "Access your Roblox accounts on Discord",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${open_sans.className} bg-neutral-900 text-neutral-100 container tracking-wide`}>
        <AuthProvider>
          <Nav/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
