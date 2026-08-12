import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/** Required by `output: "export"`: emit sitemap.xml at build time. */
export const dynamic = "force-static";

const routes = ["", "/armada", "/sewa-mobil", "/tentang", "/kontak"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/sewa-mobil" ? 0.9 : 0.7,
  }));
}
