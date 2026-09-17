"use client";

import { Bell, CheckCheck, Inbox } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useNotifications } from "@/features/admin/hooks/use-notifications";
import { cn } from "@/lib/utils";

/**
 * Bell + dropdown feed.
 *
 * The badge polls a counting endpoint; the list itself is only fetched when the
 * panel opens. That keeps an idle console down to one tiny request every 45
 * seconds instead of pulling thirty rows it will not show.
 */
export function NotificationBell({ enabled }: { enabled: boolean }) {
  const { unread, items, isLoadingItems, loadItems, markRead, markAllRead } =
    useNotifications(enabled);

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) void loadItems();
  };

  if (!enabled) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={
          unread > 0 ? `Notifikasi, ${unread} belum dibaca` : "Notifikasi, tidak ada yang baru"
        }
        className="relative inline-flex size-10 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
      >
        <Bell className="size-5" aria-hidden="true" />

        {unread > 0 ? (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold leading-5 text-white ring-2 ring-white"
          >
            {unread > 99 ? "99+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          className="animate-fade-in absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-white shadow-lift"
        >
          <header className="flex items-center justify-between gap-3 border-b border-ink-200 px-4 py-3">
            <p className="text-sm font-bold text-ink-900">Notifikasi</p>
            {unread > 0 ? (
              <button
                type="button"
                onClick={() => void markAllRead()}
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50"
              >
                <CheckCheck className="size-3.5" aria-hidden="true" />
                Tandai dibaca
              </button>
            ) : null}
          </header>

          <div className="max-h-[min(24rem,60dvh)] overflow-y-auto">
            {isLoadingItems ? (
              <p className="px-4 py-8 text-center text-sm text-ink-500">Memuat…</p>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-ink-100 text-ink-400">
                  <Inbox className="size-5" aria-hidden="true" />
                </span>
                <p className="text-sm text-ink-600">Belum ada notifikasi.</p>
              </div>
            ) : (
              <ul className="divide-y divide-ink-100">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (!item.readAt) void markRead(item.id);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex gap-3 px-4 py-3 transition-colors hover:bg-ink-50",
                        !item.readAt && "bg-brand-50/50",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-1.5 size-2 shrink-0 rounded-full",
                          item.readAt ? "bg-transparent" : "bg-brand-600",
                        )}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-ink-900">
                          {item.title}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-ink-600">
                          {item.body}
                        </span>
                        <span className="mt-1 block text-[11px] text-ink-400">
                          {formatRelative(item.createdAt)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** "3 menit lalu" reads better than a timestamp for something this recent. */
function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return "Baru saja";

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.round(hours / 24);
  if (days < 7) return `${days} hari lalu`;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}
