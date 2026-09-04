import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/** Required by `output: "export"`: emit manifest.webmanifest at build time. */
export const dynamic = "force-static";

/**
 * Declares the site's identity to browsers and operating systems: the name and
 * icons a bookmark, home-screen shortcut, or dock entry should carry. Without
 * it each browser improvises from whatever it has cached for the domain.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.productName,
    short_name: siteConfig.brandName,
    description: siteConfig.description,
    lang: "id",
    start_url: "/",
    // A marketing site, not an app: keep the browser chrome when launched
    // from a home-screen shortcut.
    display: "browser",
    background_color: "#ffffff",
    /** `--color-brand-600`. Keep in sync with `globals.css` and `layout.tsx`. */
    theme_color: "#d90000",
    icons: [
      { src: "/icon.png", sizes: "256x256", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/favicon.ico", sizes: "48x48 32x32", type: "image/x-icon" },
    ],
  };
}
