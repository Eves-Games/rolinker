import { auth } from '@/auth';
import RegisterCommandsCard from '@/components/RegisterCommandsCard';
import { commands } from '@/lib/commands';

export const runtime = "edge";

async function registerCommands() {
    'use server';

    const URL = `https://discord.com/api/v10/applications/${process.env.DISCORD_CLIENT_ID}/commands`;

    const response = await fetch(URL, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
        method: "PUT",
        body: JSON.stringify(Object.values(commands)),
    })

    if (response.ok) {
        console.log("Registered all commands")
        const data = await response.json()
        console.log(JSON.stringify(data, null, 2))
    } else {
        console.error("Error registering commands")
        let errorText = `Error registering commands \n ${response.url}: ${response.status} ${response.statusText}`
        try {
            const error = await response.text()
            if (error) {
                errorText = `${errorText} \n\n ${error}`
            }
        } catch (err) {
            console.error("Error reading body from request:", err)
        }
        console.error(errorText)
    };
};

export default async function Admin() {
    const session = await auth();

    return (
        <section className='container'>
            <h1 className='font-bold text-3xl mb-4'>Admin</h1>

            <RegisterCommandsCard registerCommands={registerCommands} />
        </section>
    );
};