import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import Nav from '@/app/_components/Nav';
import Footer from '@/app/_components/Footer'

const open_sans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RoLinker',
  description: 'Access your Roblox accounts on Discord',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <head></head>
      <body className={`${open_sans.className} bg-neutral-900 text-neutral-100 tracking-wide overflow-y-auto`}>
        <div className='min-h-screen'>
          <Nav />
          {children}
        </div>
        <hr className='border-neutral-800' />
        <Footer />
      </body>
    </html>
  );
};