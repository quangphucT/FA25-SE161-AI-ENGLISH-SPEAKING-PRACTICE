import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
<<<<<<< HEAD
      { protocol: "https", hostname: "sununi.edu.vn" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
=======
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
>>>>>>> 9769a0b46c38a65df8a33d8e386b48456435259e
    ],
    unoptimized: true, 
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;