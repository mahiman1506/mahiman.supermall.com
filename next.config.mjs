/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
         domains: ["firebasestorage.googleapis.com"],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // allows any domain; you can restrict to your image host if you want
            },
        ],
    },
};

export default nextConfig;