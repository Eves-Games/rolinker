import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import Footer from '@/app/_components/Footer'
import { ThemeProvider } from '@/components/theme-provider';
import NewNav from './_components/NewNav';
import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import { auth } from '@/auth';

const open_sans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'RoLinker',
    template: 'RoLinker - %s'
  },
  description: 'Access your Roblox accounts and manage your Roblox groups through Discord',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang='en'>
      <head />
      <body className={`${open_sans.className} bg-neutral-900 text-neutral-100 tracking-wide overflow-y-auto`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
        >
          <div className='min-h-screen'>
            <SessionProvider session={session}>
              <NewNav />
            </SessionProvider>
            {children}
          </div>
          <hr className='border-neutral-800' />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
};