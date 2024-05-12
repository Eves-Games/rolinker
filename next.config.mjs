/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: 'cdn.discordapp.com' },
            { hostname: 'tr.rbxcdn.com' }
        ]
    }
};

export default nextConfig;
