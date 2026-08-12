import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Book covers, headshots, and press assets will come from Sanity's CDN
  // once the catalog is wired up — see design-system/README for the plan.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
