import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow large video uploads through server actions.
      bodySizeLimit: "500mb",
    },
  },
};

export default nextConfig;
