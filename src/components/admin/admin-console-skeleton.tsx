/**
 * Placeholder rows shown while the fleet loads.
 *
 * Mirrors the real list's two layouts so the page does not jump when data
 * arrives.
 */
export function AdminConsoleSkeleton() {
  const rows = Array.from({ length: 4 }, (_, index) => index);

  return (
    <>
      {/* Outside the aria-hidden subtree below, or it would never be read. */}
      <p className="sr-only" role="status">
        Memuat data armada…
      </p>

      <div aria-hidden="true" className="animate-pulse">
      <ul className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => (
          <li
            key={row}
            className="flex gap-3 rounded-[var(--radius-card)] border border-ink-200 bg-white p-4"
          >
            <div className="aspect-16/10 w-24 shrink-0 rounded-lg bg-ink-100" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-2/3 rounded bg-ink-100" />
              <div className="h-3 w-1/3 rounded bg-ink-100" />
              <div className="h-6 w-24 rounded-full bg-ink-100" />
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-white md:block">
        <div className="h-11 border-b border-ink-200 bg-ink-50" />
        {rows.map((row) => (
          <div
            key={row}
            className="flex items-center gap-3 border-b border-ink-100 px-4 py-3 last:border-0"
          >
            <div className="aspect-16/10 w-16 shrink-0 rounded-lg bg-ink-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 rounded bg-ink-100" />
              <div className="h-3 w-24 rounded bg-ink-100" />
            </div>
            <div className="h-6 w-20 rounded-full bg-ink-100" />
            <div className="h-4 w-28 rounded bg-ink-100" />
            <div className="h-4 w-24 rounded bg-ink-100" />
          </div>
        ))}
        </div>
      </div>
    </>
  );
}
