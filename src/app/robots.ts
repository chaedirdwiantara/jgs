import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/** Required by `output: "export"`: emit robots.txt at build time. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // `/admin` is a private tool. It also carries `robots: noindex` in its own
    // metadata, since a disallow only keeps crawlers from fetching the page —
    // it does not keep an already-known URL out of the index.
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin/" }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
