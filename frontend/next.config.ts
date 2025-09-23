import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'image.openmoviedb.com'},
        ],
    },
};

export default nextConfig;
