import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized:
      process.env.NEXT_PUBLIC_OPTIMIZED_IMAGES &&
      process.env.NEXT_PUBLIC_OPTIMIZED_IMAGES === "false",
    remotePatterns: [
      ...(process.env.R2_PUBLIC_URL
        ? [
            {
              hostname: process.env.R2_PUBLIC_URL.replace("https://", ""),
            },
          ]
        : []),
    ],
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error"],
          }
        : false,
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|gif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/nyt-connections-hint",
        destination: "/connections-hint",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/how-to-play",
        destination: "/how-to-play-connections",
        permanent: true,
      },
      {
        source: "/nyt-connections-hints-answers-august-20-2025",
        destination: "/connections-hint/2025-08-20",
        permanent: true,
      },
      {
        source: "/connections-hint-archive",
        destination: "/connections-hint",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
