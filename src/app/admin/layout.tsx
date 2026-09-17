import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";

/**
 * The admin is a private tool on a public host, so it is kept out of search
 * results. This only stops well-behaved crawlers — access control is the API's
 * job; see `features/admin/auth/session.ts`.
 */
export const metadata: Metadata = {
  title: {
    template: "%s · Konsol Admin",
    default: "Konsol Admin",
  },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
