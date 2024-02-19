import DiscordProvider from "next-auth/providers/discord";
import type { OIDCConfig } from "@auth/core/providers"

import type { NextAuthConfig } from "next-auth"

interface UserProfile {
    sub: string;
};

export default {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            authorization: {
                params: {
                    scope: 'identify guilds'
                }
            },
        }),
        {
            id: 'roblox',
            name: 'Roblox',
            type: "oidc",
            clientId: process.env.ROBLOX_ID as string,
            clientSecret: process.env.ROBLOX_SECRET as string,
            issuer: 'https://apis.roblox.com/oauth/',
            authorization: { params: { scope: 'openid', redirect_uri: 'https://rolinker.net/auth' } },
            client: {
                authorization_signed_response_alg: 'ES256',
                id_token_signed_response_alg: 'ES256',
            },
            redirectProxyUrl: 'https://localhost:3000/api/auth',
            token: 'https://apis.roblox.com/oauth/v1/token',
            userinfo: 'https://apis.roblox.com/oauth/v1/userinfo',
            profile(profile) {
                return {
                    type: 'roblox',
                    id: profile.sub
                }
            }
        } satisfies OIDCConfig<UserProfile>
    ],
} satisfies NextAuthConfig