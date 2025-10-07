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

  async headers() {
    return [
      {
        source: "/blog/classics",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400", // 1 hour
          },
        ],
      },
      {
        source: "/blog/live",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, s-maxage=60, stale-while-revalidate=80", // 60 seconds
          },
        ],
      },
      {
        source: "/blog/updates",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=80, s-maxage=80, stale-while-revalidate= 100", // 80 seconds
          },
        ],
      },
    ];
  },
};

export default nextConfig;