import type { ReactNode } from "react";

import { SiteChrome } from "@/components/layout/site-chrome";

/**
 * Wraps every public page in the marketing chrome. `/admin` lives outside this
 * group and therefore renders without it.
 *
 * Route groups do not appear in URLs, so `(site)/armada` still serves `/armada`.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
