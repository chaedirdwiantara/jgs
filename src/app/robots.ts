import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/** Required by `output: "export"`: emit robots.txt at build time. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
