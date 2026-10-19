import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Allow large video uploads through server actions.
      bodySizeLimit: "500mb",
    },
  },
};

export default withNextIntl(nextConfig);
