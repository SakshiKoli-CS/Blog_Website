import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dev11-images.csnonprod.com',
        port: '',
        pathname: '/v3/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'images.contentstack.io',
        port: '',
        pathname: '/v3/assets/**',
      },
    ],
  },
};

export default nextConfig;
