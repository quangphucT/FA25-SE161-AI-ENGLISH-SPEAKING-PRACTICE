import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "sununi.edu.vn" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
    unoptimized: true, // ✅ Cloudinary sẽ load trực tiếp, không qua Next proxy
  },
};

export default nextConfig;
