import prisma from "@/db";
import { getServerSession, SessionStrategy, type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { RobloxProvider } from "roblox-provider";

export const options: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            authorization: { params: { scope: 'identify guilds' } },
        }),
        RobloxProvider({
            clientId: process.env.ROBLOX_ID as string,
            clientSecret: process.env.ROBLOX_SECRET as string,
            redirectUri: 'https://rolinker.net/auth',
            scopes: ["openid"],
        })
    ],
    pages: {
        signIn: '/'
    },
    session: {
        strategy: "jwt" as SessionStrategy,
        maxAge: 2 * 24 * 60 * 60
    },
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub;

            return session;
        },
        async signIn({ user, account, profile }) {
            if (account?.provider === "discord" && profile) {
                user.image = profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${Math.abs(Number(profile.id) >> 22) % 5}.png`

                return true;
            } else if (account?.provider === "roblox" && user) {
                const session = await getServerSession(options);

                const existingAccount = await prisma.accounts.findUnique({
                    where: {
                        id: user.id as string,
                    },
                });

                if (existingAccount) return '/manage/accounts';

                const accounts = await prisma.accounts.findMany({
                    where: {
                        ownerId: session?.user.id
                    },
                })

                const isPrimary = accounts.length === 0;

                await prisma.accounts.create({
                    data: {
                        id: user.id as string,
                        ownerId: session?.user.id,
                        isPrimary: isPrimary
                    }
                })

                return '/manage/accounts';
            };

            return '/';
        },
    },
};