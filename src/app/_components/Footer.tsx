'use client';

import Link from "next/link";

export default function Footer() {
    return (
        <footer className='flex flex-col gap-4 py-8 container'>
            <div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
                <section className='flex flex-col gap-1'>
                    <span className='font-bold text-xl'>RoLinker</span>
                    <Link href='/'>Home</Link>
                    <Link href='/commands'>Commands</Link>
                </section>
                <section className='flex flex-col gap-1'>
                    <span className='font-bold text-xl'>Business</span>
                    <Link href='https://eves.gg/careers-and-commissions'>Careers and Commissions</Link>
                </section>
                <section className='flex flex-col gap-1'>
                    <span className='font-bold text-xl'>Legal</span>
                    <Link href='/privacy-policy'>Privacy Policy</Link>
                    <Link href='/terms-of-service'>Terms of Service</Link>
                </section>
                <section className='flex flex-col gap-1'>
                    <span className='font-bold text-xl'>Social</span>
                    <Link href='https://discord.gg/CJDuGzwFX4' target='_blank'>Discord</Link>
                </section>
            </div>
            <p className='text-sm text-neutral-400'>&copy; 2024 Eve&apos;s Games, SP. We are not affiliated with or endorsed by the Roblox Corporation.</p>
        </footer>
    )
};