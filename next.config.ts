import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.wfftamilnadu.in/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'https://api.wfftamilnadu.in/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;