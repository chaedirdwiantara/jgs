"use client";

import { ExternalLink, KeyRound, LogOut, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { NotificationBell } from "@/components/admin/notification-bell";
import { Logo } from "@/components/layout/logo";
import { useAdminSession } from "@/features/admin/hooks/use-admin-session";
import { roleLabels } from "@/features/admin/types";

type AdminTopBarProps = {
  onOpenMenu: () => void;
  onChangePassword: () => void;
};

export function AdminTopBar({ onOpenMenu, onChangePassword }: AdminTopBarProps) {
  const { isAuthenticated, requiresLogin, user, signOut } = useAdminSession();
  const showAccount = requiresLogin && isAuthenticated;

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {showAccount ? (
            <button
              type="button"
              onClick={onOpenMenu}
              aria-label="Buka menu"
              className="-ml-1 inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          ) : null}

          <Logo priority />
          <span className="hidden shrink-0 rounded-full bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-600 sm:inline">
            Konsol Admin
          </span>
        </div>

        <div className="flex items-center gap-1">
          <NotificationBell enabled={showAccount} />

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Lihat situs</span>
          </a>

          {showAccount ? (
            <AccountMenu
              name={user?.name ?? "Operator"}
              email={user?.email ?? ""}
              role={user?.role ? roleLabels[user.role] : ""}
              onChangePassword={onChangePassword}
              onSignOut={signOut}
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}

function AccountMenu({
  name,
  email,
  role,
  onChangePassword,
  onSignOut,
}: {
  name: string;
  email: string;
  role: string;
  onChangePassword: () => void;
  onSignOut: () => void;
}) {
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

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-ink-100"
      >
        <span
          aria-hidden="true"
          className="inline-flex size-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white"
        >
          {initials(name)}
        </span>
        <span className="hidden max-w-32 truncate text-sm font-medium text-ink-700 sm:inline">
          {name}
        </span>
      </button>

      {open ? (
        <div
          role="menu"
          className="animate-fade-in absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-white shadow-lift"
        >
          <div className="border-b border-ink-200 px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink-900">{name}</p>
            {email ? <p className="truncate text-xs text-ink-500">{email}</p> : null}
            {role ? (
              <p className="mt-1.5 inline-flex rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-600">
                {role}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onChangePassword();
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-ink-700 transition-colors hover:bg-ink-50"
          >
            <KeyRound className="size-4 text-ink-400" aria-hidden="true" />
            Ubah kata sandi
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="flex w-full items-center gap-2.5 border-t border-ink-100 px-4 py-2.5 text-left text-sm text-danger-700 transition-colors hover:bg-danger-50"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Keluar
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** "Budi Santoso" → "BS"; a single name yields one letter. */
function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
