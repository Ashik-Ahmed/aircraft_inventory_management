/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.jetphotos.com'
            },
        ],
    }
};

export default nextConfig;
