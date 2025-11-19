import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack for production builds on Vercel
  experimental: {
    turbo: undefined,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sununi.edu.vn",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
    unoptimized: true, 
    dangerouslyAllowSVG: true,
  },
  // Optimize for Vercel deployment
  output: 'standalone',
  poweredByHeader: false,
};

export default nextConfig;