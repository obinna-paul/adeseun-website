import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Book covers, headshots, and press assets will come from Sanity's
      // CDN once the catalog is wired up — see design-system/README.
      { protocol: "https", hostname: "cdn.sanity.io" },
      // The former Screening Room's (now /media) video thumbnails —
      // YouTube's own CDN, real clip IDs, no API key required.
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  // Old "rooms in a house" routes, permanently moved to the new
  // executive-first site map (see lib/navigation.ts). Kept as redirects
  // rather than deleted so any external links/bookmarks to the old
  // structure still resolve.
  async redirects() {
    return [
      { source: "/library", destination: "/books", permanent: true },
      { source: "/screening-room", destination: "/media", permanent: true },
      { source: "/study", destination: "/about", permanent: true },
      { source: "/invitation", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
