import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["files.stripe.com"],
  },
  /* config options here */
  reactStrictMode: true,
};

export default nextConfig;
