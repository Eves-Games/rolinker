import { APIApplicationCommand, Routes } from "discord-api-types/v10";
import { DiscordLogo } from "../_components/DiscordLogo";
import { Metadata } from "next";
import { rest } from "@/lib/discord/rest";

export const metadata: Metadata = {
    title: 'Commands'
};

export default async function Page() {
    const res = await fetch(`https://discord.com/api/v10/applications/${process.env.DISCORD_CLIENT_ID}/commands`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch commands');
    };

    const commands: Array<APIApplicationCommand> = await res.json();

    return (
        <div className='space-y-16 mb-16'>
            <section className='bg-gradient-to-r from-[#5865F2] to-indigo-700 py-16 shadow-lg'>
                <div className='container text-center md:text-left max-w-screen-lg'>
                    <div className='flex flex-col gap-4 items-center md:items-start'>
                        <div className='flex items-center space-x-4'>
                            <DiscordLogo className='size-16 sm:size-20' />
                            <h1 className='font-black text-5xl sm:6-xl'>Commands</h1>
                        </div>
                        <h2 className='font-semibold text-2xl'>List of Discord slash commands</h2>
                    </div>
                </div>
            </section>
            <section className='container grid grid-cols-1 md:grid-cols-2 text-center md:text-left gap-16 max-w-screen-lg'>
                {commands.map((command) => (
                    <div key={command.id}>
                        <h2 className='text-4xl font-bold mb-2'>/{command.name}</h2>
                        <p className='text-xl'>{command.description}</p>
                    </div>
                ))}
            </section>
        </div>

    );
}