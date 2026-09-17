"use client";

import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { ApplicationDetailDialog } from "@/components/admin/applications/application-detail-dialog";
import { ApplicationTable } from "@/components/admin/applications/application-table";
import { LocalModeBanner } from "@/components/admin/local-mode-banner";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { useAdminSession } from "@/features/admin/hooks/use-admin-session";
import { useApplications } from "@/features/admin/hooks/use-applications";
import { applicationStatuses, statusLabels, type ApplicationStatus } from "@/features/admin/types";
import { cn } from "@/lib/utils";

const FILTERS: Array<{ value: ApplicationStatus | "semua"; label: string }> = [
  { value: "semua", label: "Semua" },
  ...applicationStatuses.map((value) => ({ value, label: statusLabels[value] })),
];

/**
 * The rental-application inbox — the screen the operator lives in.
 *
 * Opens a submission directly when the URL carries `?id=…`, which is what the
 * bell and the Telegram alert link to.
 */
export function ApplicationInbox() {
  const { isAuthenticated, canManageUsers } = useAdminSession();
  const {
    items,
    counts,
    filter,
    setFilter,
    hasMore,
    status,
    error,
    isFetching,
    isLoadingMore,
    refresh,
    loadMore,
    update,
    remove,
  } = useApplications(isAuthenticated);

  const router = useRouter();
  const searchParams = useSearchParams();
  /*
   * Deep link from the bell or the Telegram alert. Read once, in the state
   * initialiser, rather than synced in an effect — this component only ever
   * renders on the client (the `useSearchParams` bailout), so the query string
   * is already there on the first render.
   */
  const [openId, setOpenId] = useState<string | null>(() => searchParams.get("id"));

  const closeDetail = useCallback(() => {
    setOpenId(null);
    // Drop `?id=` so a refresh does not reopen what the operator just closed.
    if (searchParams.get("id")) router.replace("/admin");
  }, [router, searchParams]);

  const total = counts.baru + counts.diproses + counts.disetujui + counts.ditolak;

  return (
    <div>
      <AdminPageHeader
        title="Pengajuan Penyewa"
        description={
          status === "ready"
            ? `${total} pengajuan tercatat, ${counts.baru} belum ditinjau.`
            : "Formulir data penyewa yang masuk dari situs."
        }
        actions={
          <Button
            variant="secondary"
            onClick={() => void refresh()}
            disabled={isFetching || status === "loading"}
          >
            <RefreshCw
              className={cn("size-4", (isFetching || status === "loading") && "animate-spin")}
              aria-hidden="true"
            />
            Muat ulang
          </Button>
        }
      />

      <LocalModeBanner />

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Saring status">
        {FILTERS.map((item) => {
          const active = filter === item.value;
          const count = item.value === "semua" ? total : counts[item.value];

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              aria-pressed={active}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium ring-1 ring-inset transition-colors",
                active
                  ? "bg-brand-600 text-white ring-brand-600"
                  : "bg-white text-ink-700 ring-ink-200 hover:bg-ink-50 hover:ring-ink-300",
              )}
            >
              {item.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs font-semibold",
                  active ? "bg-white/20" : "bg-ink-100 text-ink-600",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {status === "loading" ? <InboxSkeleton /> : null}

        {status === "error" ? (
          <ErrorState message={error} onRetry={() => void refresh()} />
        ) : null}

        {status === "ready" && items.length === 0 ? <EmptyState filter={filter} /> : null}

        {status === "ready" && items.length > 0 ? (
          <>
            <ApplicationTable items={items} onOpen={(item) => setOpenId(item.id)} />

            {hasMore ? (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="secondary"
                  onClick={() => void loadMore()}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? "Memuat…" : "Muat lebih banyak"}
                </Button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      {/*
        Keyed by the open application so each one gets a fresh dialog: no
        chance of showing the previous renter's note while the next one loads.
      */}
      <ApplicationDetailDialog
        key={openId ?? "empty"}
        applicationId={openId}
        canDelete={canManageUsers}
        onClose={closeDetail}
        onSave={update}
        onDelete={remove}
      />
    </div>
  );
}

function InboxSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-20 animate-pulse rounded-[var(--radius-card)] border border-ink-200 bg-white"
        />
      ))}
      <span className="sr-only">Memuat pengajuan…</span>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-danger-200 bg-white p-10 text-center shadow-soft"
    >
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-danger-50 text-danger-600">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </span>
      <div>
        <p className="font-semibold text-ink-900">Gagal memuat pengajuan</p>
        <p className="mt-1 text-sm text-ink-600">{message ?? "Terjadi kesalahan."}</p>
      </div>
      <Button variant="secondary" onClick={onRetry}>
        <RefreshCw className="size-4" aria-hidden="true" />
        Coba lagi
      </Button>
    </div>
  );
}

function EmptyState({ filter }: { filter: ApplicationStatus | "semua" }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-dashed border-ink-300 bg-white p-10 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-ink-100 text-ink-500">
        <Inbox className="size-6" aria-hidden="true" />
      </span>
      <div>
        <p className="font-semibold text-ink-900">
          {filter === "semua"
            ? "Belum ada pengajuan masuk"
            : `Tidak ada pengajuan berstatus "${statusLabels[filter]}"`}
        </p>
        <p className="mt-1 text-sm text-ink-600">
          Pengajuan muncul di sini segera setelah calon penyewa mengirim formulir
          di halaman <span className="font-mono text-xs">/formulir</span>.
        </p>
      </div>
    </div>
  );
}
