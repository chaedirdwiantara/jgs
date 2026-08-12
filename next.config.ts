import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Deployed as static files to S3 behind CloudFront, so `next build` must emit
   * plain HTML/CSS/JS into `out/` instead of expecting a Node.js server.
   * Consequence: no server actions, route handlers reading the request, or
   * middleware — see `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`.
   */
  output: "export",

  /**
   * Emit `armada/index.html` instead of `armada.html`, the layout every static
   * host resolves without extra rewrite rules. Next also normalises the emitted
   * `<link rel="canonical">` to match, and `sitemap.ts` follows suit.
   */
  trailingSlash: true,

  images: {
    /**
     * The default image loader needs the Next.js server. Nothing uses
     * `next/image` yet; this keeps the build working when something does.
     */
    unoptimized: true,
  },
};

export default nextConfig;
