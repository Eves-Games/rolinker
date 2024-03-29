import NextAuth from "next-auth";
import db from "@/lib/db";
import authConfig from "@/auth.config";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    session: { strategy: "jwt" },
    pages: { signIn: '/' },
    callbacks: {
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.sub;
                session.user.access_token = token.accessToken;
                delete session.user.email;
            }
            return session;
        },
        async jwt({ token, account }) {
            if (account) {
                token.sub = account.providerAccountId;
                token.accessToken = account.access_token;
            }

            return token;
        },
        async signIn({ user, account, profile }) {
            if (account?.provider === "discord" && profile) {
                user.image = profile.image_url as string;
                user.name = profile.username as string;

                return true;
            } else if (account?.provider === "roblox") {
                const session = await auth();

                const existingAccount = await db.account.findUnique({
                    where: {
                        id: session?.user.id
                    },
                });

                if (existingAccount) return '/manage/accounts';

                const existingAccounts = await db.account.findMany({
                    where: {
                        userId: session?.user.id,
                    },
                });

                const isPrimary = existingAccounts.length === 0;

                await db.account.create({
                    data: {
                        id: profile?.sub as string,
                        userId: session?.user.id,
                        isPrimary: isPrimary,
                    },
                });

                return '/manage/accounts';
            }

            return '/';
        },
    },
    ...authConfig
});