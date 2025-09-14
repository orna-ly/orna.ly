import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable the latest features
  },
  images: {
    domains: ["localhost", "orna.ly"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // i18n is handled by the app router with Jotai state management
  // Removed i18n config as it's not supported in App Router
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*", // Laravel API when ready
      },
    ];
  },
};

export default nextConfig;
