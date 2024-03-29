import db from "@/lib/db";
import { Account } from "@prisma/client/edge";

export async function findAssociatedAccount(userId: string, guildId: string) {
    let account: Account | null;
    const accountGuild = await db.accountGuild.findUnique({
        where: {
            userId_guildId: {
                userId,
                guildId
            }
        },
        include: {
            account: true
        }
    });

    if (accountGuild) {
        account = accountGuild.account
    } else {
        account = await db.account.findUnique({
            where: {
                onePrimaryAccountPerUser: {
                    userId,
                    isPrimary: true
                }
            }
        });
    };

    return account;
}