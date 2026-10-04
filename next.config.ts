import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  typedRoutes: true,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // Static Cloudflare Pages exports cannot use the Next.js image optimizer.
    // Source files are already WebP; next/image still provides dimensions,
    // lazy loading, and fetch priority.
    unoptimized: true,
  },
};

export default nextConfig;
