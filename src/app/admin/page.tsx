import { Suspense } from "react";

import { ApplicationInbox } from "@/components/admin/applications/application-inbox";

/*
 * `absolute`, unlike the sibling admin pages: a layout's `title.template`
 * applies to *child* segments only, and this page shares the `/admin` segment
 * with the layout that defines it. Without this the tab would read
 * "Pengajuan | Jayanagiri" here and "Armada · Konsol Admin" one click away.
 * See node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md.
 */
export const metadata = { title: { absolute: "Pengajuan · Konsol Admin" } };

/**
 * The console's home screen: rental applications submitted from `/formulir`.
 *
 * Statically exported like the rest of the site — this route ships an empty
 * shell that hydrates and then talks to the API from the browser. That is the
 * supported pattern for `output: "export"`; see
 * `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`.
 *
 * The `<Suspense>` boundary is required, not decorative: the inbox reads `?id=`
 * via `useSearchParams` to deep-link a submission, and on a prerendered route
 * that forces the subtree to render on the client. Without a boundary the build
 * fails.
 */
export default function AdminPengajuanPage() {
  return (
    <Suspense fallback={<InboxFallback />}>
      <ApplicationInbox />
    </Suspense>
  );
}

function InboxFallback() {
  return (
    <div>
      <div className="h-8 w-56 animate-pulse rounded-lg bg-ink-200" />
      <div className="mt-6 flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-[var(--radius-card)] border border-ink-200 bg-white"
          />
        ))}
      </div>
      <span className="sr-only">Memuat pengajuan…</span>
    </div>
  );
}
