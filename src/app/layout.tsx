import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import Footer from '@/app/_components/Footer'
import Nav from '@/components/Nav';

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
  return (
    <html lang='en' data-theme='business'>
      <head />
      <body className={`${open_sans.className} tracking-wide overflow-y-auto`}>
        <div className='min-h-screen'>
          <Nav />
          {children}
        </div>
        <hr className='border-secondary' />
        <Footer />
      </body>
    </html>
  );
};