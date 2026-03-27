import type { NextConfig } from "next";

const nextConfig: any = {
  transpilePackages: ["jspdf", "fflate"],
  experimental: {},
  turbopack: {
    resolveAlias: {
      fflate: "fflate/browser",
    },
  },
  webpack: (config: any) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      fflate: "fflate/browser",
    };
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
