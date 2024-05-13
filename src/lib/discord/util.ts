import db from "@/lib/db";
import { Account, Guild } from "@prisma/client/edge";

export async function findAssociatedAccount(userId: string, guildId: string) {
    let account: Account | null;
    const accountGuild = await db.accountGuild.findUnique({
        where: { userId_guildId: { userId, guildId } },
        include: { account: true }
    });

    if (accountGuild) {
        account = accountGuild.account
    } else {
        account = await db.account.findUnique({
            where: { onePrimaryAccountPerUser: { userId, isPrimary: true } }
        });
    };

    return account;
};

export async function getRelatedGuilds(guildId: string): Promise<Guild[]> {
    const visitedGuildIds = new Set<string>();
    const relatedGuilds: Guild[] = [];

    async function fetchRelatedGuilds(currentGuildId: string) {
        if (visitedGuildIds.has(currentGuildId)) return;

        visitedGuildIds.add(currentGuildId);

        const guild = await db.guild.findUnique({
            where: { id: currentGuildId },
            include: {
                parentGuild: true,
                childGuilds: true,
            },
        });

        if (guild) {
            relatedGuilds.push(guild);
            if (guild.parentGuild) await fetchRelatedGuilds(guild.parentGuild.id);
            for (const childGuild of guild.childGuilds) await fetchRelatedGuilds(childGuild.id);
        }
    }

    await fetchRelatedGuilds(guildId);

    return relatedGuilds;
};