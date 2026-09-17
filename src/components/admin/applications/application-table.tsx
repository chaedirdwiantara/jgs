"use client";

import { ChevronRight, UserRound } from "lucide-react";

import { StatusBadge } from "@/components/admin/applications/status-badge";
import { displayVehicle } from "@/data/rental-form-options";
import type { ApplicationSummary } from "@/features/admin/types";
import { formatDateShortID } from "@/lib/format";

/**
 * The inbox list.
 *
 * A real `<table>` from `md` up, stacked cards below it. The same rows either
 * way — a horizontally scrolling table on a phone is how operators miss the
 * column that mattered.
 */
export function ApplicationTable({
  items,
  onOpen,
}: {
  items: ApplicationSummary[];
  onOpen: (item: ApplicationSummary) => void;
}) {
  return (
    <>
      {/* Mobile */}
      <ul className="flex flex-col gap-3 md:hidden">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onOpen(item)}
              className="flex w-full items-start gap-3 rounded-[var(--radius-card)] border border-ink-200 bg-white p-4 text-left shadow-soft transition-colors hover:border-ink-300"
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-ink-900">
                    {item.fullName}
                  </span>
                  <StatusBadge status={item.status} />
                </span>
                <span className="mt-1 block font-mono text-xs text-ink-400">
                  {item.referenceCode}
                </span>
                <span className="mt-2 block text-xs text-ink-600">
                  {displayVehicle(item)} ·{" "}
                  {item.withDriver ? "Dengan driver" : "Lepas kunci"}
                </span>
                <span className="mt-0.5 block text-xs text-ink-500">
                  {formatDateShortID(item.startDate)} · {item.durationDays} hari
                </span>
              </span>
              <ChevronRight className="mt-1 size-4 shrink-0 text-ink-400" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-white shadow-soft md:block">
        <table className="w-full text-left">
          <caption className="sr-only">Daftar pengajuan penyewa</caption>
          <thead>
            <tr className="border-b border-ink-200 bg-ink-50">
              <Th>Penyewa</Th>
              <Th>Unit</Th>
              <Th>Mulai</Th>
              <Th>Durasi</Th>
              <Th>Status</Th>
              <Th>Masuk</Th>
              <th scope="col" className="w-12" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {items.map((item) => (
              <tr
                key={item.id}
                onClick={() => onOpen(item)}
                className="cursor-pointer transition-colors hover:bg-ink-50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500"
                    >
                      <UserRound className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink-900">
                        {item.fullName}
                      </span>
                      <span className="block font-mono text-xs text-ink-400">
                        {item.referenceCode}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="block text-sm text-ink-800">
                    {displayVehicle(item)}
                  </span>
                  <span className="block text-xs text-ink-500">
                    {item.withDriver ? "Dengan driver" : "Lepas kunci"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-ink-700">
                  {formatDateShortID(item.startDate)}
                </td>
                <td className="px-4 py-3 text-sm text-ink-700">{item.durationDays} hari</td>
                <td className="px-4 py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3 text-sm text-ink-500">
                  {formatDateShortID(item.submittedAt.slice(0, 10))}
                </td>
                <td className="px-4 py-3">
                  <ChevronRight className="size-4 text-ink-400" aria-hidden="true" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      scope="col"
      className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-500"
    >
      {children}
    </th>
  );
}
