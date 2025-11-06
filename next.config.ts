import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "sununi.edu.vn" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { 
        protocol: "https", 
        hostname: "res.cloudinary.com",
        pathname: "/**" // Accept all paths from Cloudinary
      },
    ],
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
};

export default nextConfig;
