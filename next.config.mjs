/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                // hostname: 'cdn.jetphotos.com'
                hostname: 'i.ibb.co'
            },
        ],
    }
};

export default nextConfig;
