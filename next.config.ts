import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Content is read from MDX files at build time, so every page is fully
  // static HTML with metadata in <head>. Cache Components is off on purpose.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // course certificate renders (see lib/certificates.ts)
    remotePatterns: [
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "api2.sololearn.com", pathname: "/v2/certificates/**" },
    ],
  },
  async redirects() {
    return [
      { source: "/project", destination: "/work", permanent: true },
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/certificate", destination: "/certificates", permanent: true },
      { source: "/now", destination: "/about", permanent: false },
      { source: "/writing", destination: "/blog", permanent: true },
      { source: "/feed", destination: "/rss.xml", permanent: true },
      { source: "/feed.xml", destination: "/rss.xml", permanent: true },
    ];
  },
};

export default nextConfig;
