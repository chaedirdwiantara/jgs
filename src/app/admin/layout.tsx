import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminTopBar } from "@/components/admin/admin-top-bar";

/**
 * The admin is a private tool on a public host, so it is kept out of search
 * results. This only stops well-behaved crawlers — access control is the API's
 * job; see `features/admin/auth/session.ts`.
 */
export const metadata: Metadata = {
  title: "Konsol Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-ink-50">
      <AdminTopBar />
      <main id="konten" className="flex-1">
        {children}
      </main>
    </div>
  );
}
