"use client";

import { useCallback, useSyncExternalStore } from "react";

import { isBackendConfigured } from "../config";
import { signOut as clearSession } from "../auth/auth-service";
import { readToken, subscribeToSession } from "../auth/session";

/**
 * Whether the operator may use the admin.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect`: the token lives
 * outside React (sessionStorage), and this keeps every consumer — including a
 * second tab — in step without a render-then-correct flash.
 *
 * The server snapshot is deliberately `null`: the page is prerendered at build
 * time where no storage exists, so it must render the signed-out shell and let
 * hydration settle the truth. Anything else mismatches.
 */
export function useAdminSession() {
  const token = useSyncExternalStore(subscribeToSession, readToken, () => null);

  const signOut = useCallback(() => clearSession(), []);

  return {
    token,
    /*
     * Local mode has no server to authenticate against, so gating behind a
     * password form would be pure theatre. The UI says so instead.
     */
    isAuthenticated: isBackendConfigured ? token !== null : true,
    requiresLogin: isBackendConfigured,
    signOut,
  };
}
