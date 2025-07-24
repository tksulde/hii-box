import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.hii.link",
      },
    ],
  },
};

export default nextConfig;
