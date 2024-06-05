import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { twMerge } from "tailwind-merge";
import { FreePlanModal } from "@/components/modals/FreePlanModal";

const open_sans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rolinker.net"),
  title: {
    default: "RoLinker",
    template: "RoLinker - %s",
  },
  description:
    "Access your Roblox accounts and manage your Roblox groups through Discord",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={twMerge(
          open_sans.className,
          "overflow-y-auto tracking-wide",
        )}
      >
        <FreePlanModal />
        <div className="min-h-screen">
          <Nav />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
