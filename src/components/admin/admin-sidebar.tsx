"use client";

import { Car, Inbox, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

export type SidebarItem = {
  href: string;
  label: string;
  description: string;
  icon: typeof Inbox;
};

/**
 * No unread pill here on purpose: the bell already announces new submissions,
 * and a second badge would need its own poll and its own chance to disagree
 * with the counts the inbox itself shows.
 */
export function buildSidebarItems(options: { canManageUsers: boolean }): SidebarItem[] {
  const items: SidebarItem[] = [
    {
      href: "/admin",
      label: "Pengajuan",
      description: "Formulir penyewa masuk",
      icon: Inbox,
    },
    {
      href: "/admin/armada",
      label: "Armada",
      description: "Data unit & tarif",
      icon: Car,
    },
  ];

  if (options.canManageUsers) {
    items.push({
      href: "/admin/pengguna",
      label: "Pengguna",
      description: "Akun konsol admin",
      icon: Users,
    });
  }

  return items;
}

/**
 * `trailingSlash: true` means the browser is on `/admin/armada/`, while the
 * hrefs are written without the slash. Comparing normalised paths keeps the
 * active state from silently never matching.
 */
function isActive(pathname: string, href: string): boolean {
  const current = pathname.replace(/\/+$/, "") || "/";
  return current === href;
}

type AdminSidebarProps = {
  items: SidebarItem[];
  /** Controls the mobile drawer only; from `lg` up the rail is always shown. */
  open: boolean;
  onClose: () => void;
};

export function AdminSidebar({ items, open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  // Navigating is the point of the drawer, so it closes itself on arrival.
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-[1px] transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <nav
        aria-label="Navigasi konsol admin"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[17rem] border-r border-ink-200 bg-white transition-transform duration-300 ease-[var(--ease-out-soft)]",
          "lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100dvh-4rem)] lg:translate-x-0 lg:transition-none",
          open ? "translate-x-0 shadow-lift" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-ink-200 px-4 lg:hidden">
          <span className="text-sm font-semibold text-ink-900">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="inline-flex size-9 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <ul className="flex flex-col gap-1 p-3">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--radius-field)] px-3 py-2.5 transition-colors",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
                  )}
                >
                  <Icon
                    className={cn("size-5 shrink-0", active ? "text-brand-600" : "text-ink-400")}
                    aria-hidden="true"
                  />

                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block text-sm font-semibold",
                        active ? "text-brand-800" : "text-ink-900",
                      )}
                    >
                      {item.label}
                    </span>
                    <span className="block truncate text-xs text-ink-500">
                      {item.description}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
