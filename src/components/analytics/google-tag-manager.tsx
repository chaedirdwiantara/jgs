import { GoogleTagManager as NextGoogleTagManager } from "@next/third-parties/google";

import { siteConfig } from "@/config/site";

/**
 * Google Tag Manager container for the public site.
 *
 * Production builds only, so `next dev` sessions never show up in analytics.
 * `@next/third-parties` loads `gtm.js` after hydration (`next/script`,
 * `afterInteractive`), which keeps the tag off the critical path; it does not
 * emit GTM's `<noscript>` fallback, so that part is rendered here by hand.
 */
export function GoogleTagManager() {
  if (process.env.NODE_ENV !== "production") return null;

  const { tagManagerId } = siteConfig.google;

  return (
    <>
      <NextGoogleTagManager gtmId={tagManagerId} />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${tagManagerId}`}
          title="Google Tag Manager"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
