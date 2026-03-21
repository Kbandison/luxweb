import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'quajunlkbfihjczubmxl.supabase.co',
      },
    ],
  },
};

export default nextConfig;
