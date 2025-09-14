import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable the latest features
  },
  images: {
    domains: ['localhost', 'orna.ly'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Support for both LTR and RTL
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    localeDetection: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*' // Laravel API when ready
      }
    ]
  }
};

export default nextConfig;
