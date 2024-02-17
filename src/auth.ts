import NextAuth from "next-auth";
import db from "@/db";
import authConfig from "@/auth.config";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub;

            return session;
        },
        async signIn({ user, account, profile }) {
            if (account?.provider === "discord" && profile) {
                user.image = profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${Math.abs(Number(profile.id) >> 22) % 5}.png`;
                user.id = profile.id as string;

                return true;
            } else if (account?.provider === "roblox") {
                const session = await auth();

                const existingAccount = await db.accounts.findUnique({
                    where: {
                        id: session?.user.id
                    },
                });

                if (existingAccount) return '/manage/accounts';

                const existingAccounts = await db.accounts.findMany({
                    where: {
                        ownerId: session?.user.id,
                    },
                });

                const isPrimary = existingAccounts.length === 0;

                await db.accounts.create({
                    data: {
                        id: profile?.sub as string,
                        ownerId: session?.user.id,
                        isPrimary: isPrimary,
                    },
                });

                return '/manage/accounts';
            }

            return '/';
        },
    },
    pages: { signIn: '/' },
    session: { strategy: "jwt" },
    ...authConfig
});