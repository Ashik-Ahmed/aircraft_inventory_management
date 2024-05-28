import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                // hostname: 'cdn.jetphotos.com'
                hostname: 'i.ibb.co',
            },
        ],
    },
    swcMinify: true, // Enable SWC Minification for faster builds
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.module.rules.push({
                test: /\.js$/,
                use: ['thread-loader'],
                exclude: /node_modules/,
            });
        }
        return config;
    },
};

// Enable bundle analyzer only when ANALYZE environment variable is set to 'true'
export default withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})(nextConfig);
