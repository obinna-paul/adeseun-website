import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Book covers, headshots, and press assets will come from Sanity's
      // CDN once the catalog is wired up — see design-system/README.
      { protocol: "https", hostname: "cdn.sanity.io" },
      // The Screening Room's video thumbnails — YouTube's own CDN,
      // real clip IDs, no API key required.
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
