import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow large video uploads through server actions.
      bodySizeLimit: "500mb",
    },
  },
};

export default withNextIntl(nextConfig);
