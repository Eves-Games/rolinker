declare module 'roblox-provider' {
    export interface RobloxProviderOptions {
        clientId: string;
        clientSecret: string;
        scopes: string[];
        include?: string[];
        redirectUri: string;
        checks?: string[];
        rest?: any;
    }

    export interface UserProfile {
        sub: string;
        preferred_username: string;
        nickname: string;
    }

    export interface RobloxProfile {
        type: 'roblox';
        id: string;
        name: string;
        displayName: string;
        avatar?: string;
        description?: string;
        created?: string;
        hasVerifiedBadge?: boolean;
        include?: string[];
    }

    export interface Token {
        id: string;
        name?: string;
        displayName?: string;
        avatar?: string;
        description?: string;
        created?: string;
        hasVerifiedBadge?: boolean;
        type?: string;
    }

    export interface Session {
        user: {
            id: string;
            name?: string;
            displayName?: string;
            avatar?: string;
            description?: string;
            created?: string;
            hasVerifiedBadge?: boolean;
        },
        expires: string;
    }

    export function RobloxProvider(options: RobloxProviderOptions): any;
    export function RobloxProviderJwtCallback(token: Token, user?: RobloxProfile): Promise<Token>;
    export function RobloxProviderSessionCallback(session: Session, tokenOrUser: Token | RobloxProfile): Promise<Session>;

    export const RobloxProviderCallbacks_Jwt: {
        jwt({ token, user }: { token: Token; user?: RobloxProfile }): Promise<Token>;
        session({ session, token }: { session: Session; token: Token }): Promise<Session>;
    };

    export const RobloxProviderCallbacks_Database: {
        session({ session, user }: { session: Session; user: RobloxProfile }): Promise<Session>;
    };
}