/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: 'cdn.discordapp.com' },
            { hostname: 'tr.rbxcdn.com' }
        ]
    },
    async redirects() {
        return [
            {
                source: '/privacy-policy',
                destination: 'https://www.iubenda.com/privacy-policy/42805761',
                permanent: true
            }
        ]
    }
};

export default nextConfig;
