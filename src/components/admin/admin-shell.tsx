"use client";

import { useCallback, useState, type ReactNode } from "react";

import { AdminSidebar, buildSidebarItems } from "@/components/admin/admin-sidebar";
import { AdminTopBar } from "@/components/admin/admin-top-bar";
import { ChangePasswordDialog } from "@/components/admin/change-password-dialog";
import { LoginForm } from "@/components/admin/login-form";
import { useAdminSession } from "@/features/admin/hooks/use-admin-session";

/**
 * Chrome shared by every console screen: top bar, navigation rail, and the
 * sign-in gate.
 *
 * The gate is convenience, not security — `/admin` is a static HTML file anyone
 * can open. Every screen behind it gets its data from an API that authorises
 * each request on its own; see `features/admin/auth/session.ts`.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const { isAuthenticated, requiresLogin, canManageUsers } = useAdminSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  if (requiresLogin && !isAuthenticated) {
    return (
      <div className="flex min-h-dvh flex-col bg-ink-50">
        <AdminTopBar onOpenMenu={closeMenu} onChangePassword={() => setPasswordOpen(false)} />
        <main id="konten" className="flex-1">
          <LoginForm />
        </main>
      </div>
    );
  }

  const items = buildSidebarItems({ canManageUsers });

  return (
    <div className="min-h-dvh bg-ink-50">
      <AdminTopBar
        onOpenMenu={() => setMenuOpen(true)}
        onChangePassword={() => setPasswordOpen(true)}
      />

      <div className="mx-auto flex w-full max-w-[100rem]">
        <AdminSidebar items={items} open={menuOpen} onClose={closeMenu} />

        {/* `min-w-0` stops a wide table from forcing the whole page to scroll. */}
        <main id="konten" className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>

      <ChangePasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </div>
  );
}
