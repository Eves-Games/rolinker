'use client';

import Link from "next/link";

export default function Footer() {
    return (
        <footer className='flex flex-col gap-4 py-8 container'>
            <div className='grid grid-flow-col gap-8 md:gap-0'>
                <section className='flex flex-col gap-1'>
                    <span className='font-bold text-xl'>RoLinker</span>
                    <Link href='/'>Home</Link>
                    <Link href='/commands'>Commands</Link>
                </section>
                <section className='flex flex-col gap-1'>
                    <span className='font-bold text-xl'>Legal</span>
                    <Link href='/privacy-policy'>Privacy Policy</Link>
                    <Link href='/terms-and-services'>Terms and Services</Link>
                </section>
                <section className='flex flex-col gap-1'>
                    <span className='font-bold text-xl'>Social</span>
                    <a href='https://discord.gg/CJDuGzwFX4'>Discord</a>
                </section>
            </div>
            <p className='text-sm text-neutral-400'>© 2024 Eve's Games, SP. We are not affiliated with or endorsed by the Roblox Corporation.</p>
        </footer>
    )
};