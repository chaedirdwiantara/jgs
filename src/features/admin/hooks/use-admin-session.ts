"use client";

import { useCallback, useSyncExternalStore } from "react";

import { isBackendConfigured } from "../config";
import { signOut as clearSession } from "../auth/auth-service";
import { readToken, readUser, subscribeToSession } from "../auth/session";
import type { AdminUser } from "../types";

/**
 * Whether the operator may use the admin, and who they are.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect`: the session lives
 * outside React (sessionStorage), and this keeps every consumer — including a
 * second tab — in step without a render-then-correct flash.
 *
 * The server snapshot is deliberately `null`: the page is prerendered at build
 * time where no storage exists, so it must render the signed-out shell and let
 * hydration settle the truth. Anything else mismatches.
 */
export function useAdminSession() {
  const token = useSyncExternalStore(subscribeToSession, readToken, () => null);
  const user = useSyncExternalStore(subscribeToSession, readUser, () => null);

  const signOut = useCallback(() => clearSession(), []);

  const isAuthenticated = isBackendConfigured ? token !== null : true;

  return {
    token,
    user: user as AdminUser | null,
    /*
     * Local mode has no server to authenticate against, so gating behind a
     * password form would be pure theatre. The UI says so instead.
     */
    isAuthenticated,
    requiresLogin: isBackendConfigured,
    /**
     * Drives what the sidebar offers. Authorisation itself is the API's job —
     * in local mode there is no server at all, so everything is on show.
     */
    canManageUsers: isBackendConfigured ? user?.role === "owner" : true,
    signOut,
  };
}
