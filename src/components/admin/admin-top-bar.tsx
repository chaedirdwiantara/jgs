"use client";

import { ExternalLink, LogOut } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { useAdminSession } from "@/features/admin/hooks/use-admin-session";

export function AdminTopBar() {
  const { isAuthenticated, requiresLogin, signOut } = useAdminSession();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Logo priority />
          <span className="hidden shrink-0 rounded-full bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-600 sm:inline">
            Konsol Admin
          </span>
        </div>

        <div className="flex items-center gap-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Lihat situs</span>
          </a>

          {requiresLogin && isAuthenticated ? (
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
            >
              <LogOut className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
