import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";

/**
 * Public-facing shell: header, footer and the WhatsApp button.
 *
 * Lives here rather than in the root layout so `/admin` — which shares the
 * root layout's `<html>`/fonts but none of its marketing chrome — can opt out.
 * Used by the `(site)` route group and by the 404 page, which sits outside that
 * group but should still look like the website.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Lompat ke konten utama
      </a>

      <SiteHeader />
      <main id="konten" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
