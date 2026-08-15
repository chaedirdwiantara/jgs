/**
 * Admin session token.
 *
 * ⚠️ Where the real protection lives
 * The public site is a static export, so `/admin` is a plain HTML file that
 * anyone can open. Nothing rendered here is a security boundary. The API is:
 * every request carries this token and the AWS backend must reject any request
 * without a valid one. Treat the screens as a convenience shell around an API
 * that does its own authorisation.
 *
 * Stored in `sessionStorage`, not `localStorage`, so the token dies with the
 * tab. A same-origin, `httpOnly` cookie would be safer against XSS, but the API
 * is on a different origin from the static site, which rules it out here.
 */
const STORAGE_KEY = "jgs.admin.token";

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
  return storage()?.getItem(STORAGE_KEY) ?? null;
}

export function writeToken(token: string): void {
  storage()?.setItem(STORAGE_KEY, token);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearToken(): void {
  storage()?.removeItem(STORAGE_KEY);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Subscribes to sign-in/sign-out from this tab and from other tabs. */
export function subscribeToSession(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) onChange();
  };

  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}
