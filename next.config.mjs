/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: 'cdn.discordapp.com' },
            { hostname: 'tr.rbxcdn.com' }
        ]
    },
    experimental: {
        esmExternals: true
    }
};

export default nextConfig;
