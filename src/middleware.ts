import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const callbackUrl = nextUrl.pathname;
    const isLoggedIn = req.auth;

    if (!isLoggedIn) {
        return Response.redirect(new URL(`/api/signIn?callbackUrl=${callbackUrl}`, nextUrl));
    };

    return;
});

export const config = {
    matcher: ['/manage/:path*', '/settings/:path*'],
};