import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'image.openmoviedb.com'},
            { protocol: 'https', hostname: 'avatars.mds.yandex.net'},
        ],
    },
};

export default nextConfig;
