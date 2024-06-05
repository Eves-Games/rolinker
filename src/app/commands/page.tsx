import { Metadata } from "next";
import DiscordLogo from "@/components/DiscordLogo";
import { commands } from "@/commands";

export const metadata: Metadata = {
  title: "Commands",
};

interface CommandData {
  name: string;
  description: string;
}

const CommandCard = ({ name, description }: CommandData) => {
  return (
    <div className="card bg-base-200 shadow">
      <div className="card-body">
        <h2 className="card-title">/{name}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <div className="space-y-12">
      <section className="hero bg-gradient-to-r from-[#5865F2] to-indigo-700 py-12 shadow">
        <div className="hero-content flex w-full max-w-screen-lg flex-col items-center md:items-start">
          <h1 className="text-5xl font-black">
            <DiscordLogo className="inline-block size-14 fill-white" /> Commands
          </h1>
          <h2 className="text-2xl font-semibold">
            List of Discord slash commands
          </h2>
        </div>
      </section>
      <section className="container mx-auto max-w-screen-lg space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Object.values(commands).map((command) =>
            (command as { options?: any[] }).options ? (
              (command as { options: any[] }).options.map((option) => (
                <CommandCard
                  key={option.name}
                  name={`${command.name} ${option.name}`}
                  description={option.description}
                />
              ))
            ) : (
              <CommandCard
                key={command.name}
                name={command.name}
                description={command.description}
              />
            ),
          )}
        </div>
      </section>
    </div>
  );
}
