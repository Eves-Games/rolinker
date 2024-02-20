import { APIApplicationCommand } from "discord-api-types/v10";

export const runtime = 'edge';

export default async function Page() {
    const res = await fetch(`https://discord.com/api/v10/applications/${process.env.DISCORD_CLIENT_ID}/commands`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch commands');
    };

    const commands = await res.json() as Array<APIApplicationCommand>;

    return (
        <section className='container'>
            <h1 className='font-bold text-3xl mb-4'>Commands</h1>

            {commands.map((command) => (
                <div key={command.id}>
                    <h2 className='font-semibold'>{command.name}</h2>
                    <p>{command.description}</p>
                </div>
            ))}

            {commands.length < 1 && <p>No commands found.</p>}
        </section>
    );
}