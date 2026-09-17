import type { AdminUser } from "../types";

/**
 * Admin session: the bearer token and the profile that goes with it.
 *
 * ⚠️ Where the real protection lives
 * The public site is a static export, so `/admin` is a plain HTML file that
 * anyone can open. Nothing rendered here is a security boundary — including the
 * role stored below, which only decides what the sidebar shows. The API is the
 * boundary: every request carries this token and the AWS backend rejects any
 * request without a valid one, and re-checks the role on every owner-only route.
 *
 * Stored in `sessionStorage`, not `localStorage`, so the session dies with the
 * tab. A same-origin, `httpOnly` cookie would be safer against XSS, but the API
 * is on a different origin from the static site, which rules it out here.
 */
const TOKEN_KEY = "jgs.admin.token";
const USER_KEY = "jgs.admin.user";

/** Notifies hooks in the same tab; `storage` events only fire cross-tab. */
const CHANGE_EVENT = "jgs:admin-session";

/** `sessionStorage` throws in private-mode Safari and is absent while prerendering. */
function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function readToken(): string | null {
  return storage()?.getItem(TOKEN_KEY) ?? null;
}

/**
 * `useSyncExternalStore` compares snapshots by reference and throws if a new
 * one appears on every read, so the parsed profile is memoised against the raw
 * string it came from.
 */
let userCache: { raw: string; value: AdminUser | null } | null = null;

export function readUser(): AdminUser | null {
  const raw = storage()?.getItem(USER_KEY) ?? "";
  if (!raw) {
    userCache = null;
    return null;
  }

  if (userCache?.raw === raw) return userCache.value;

  let value: AdminUser | null = null;
  try {
    value = JSON.parse(raw) as AdminUser;
  } catch {
    value = null;
  }

  userCache = { raw, value };
  return value;
}

export function writeSession(token: string, user: AdminUser | null): void {
  const store = storage();
  if (!store) return;

  store.setItem(TOKEN_KEY, token);
  if (user) store.setItem(USER_KEY, JSON.stringify(user));
  else store.removeItem(USER_KEY);

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearToken(): void {
  const store = storage();
  store?.removeItem(TOKEN_KEY);
  store?.removeItem(USER_KEY);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Subscribes to sign-in/sign-out from this tab and from other tabs. */
export function subscribeToSession(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === TOKEN_KEY || event.key === USER_KEY) onChange();
  };

  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}
