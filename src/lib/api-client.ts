import { apiBaseUrl, REQUEST_TIMEOUT_MS } from "@/config/api";

import {
  FALLBACK_MESSAGE,
  KIND_BY_STATUS,
  RepositoryError,
  type RepositoryErrorKind,
} from "./api-error";

export type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  /** Bearer token. Omitted for the public rental form, which has none. */
  token?: string;
  /** Invoked when the API rejects the token, so the caller can drop it. */
  onUnauthorized?: () => void;
};

/** Error envelope the API returns: `{ message, errors? }`. */
type ErrorPayload = {
  message?: string;
  error?: string;
  errors?: Record<string, string | string[]>;
};

/** Flattens `{ field: ["a", "b"] }` into `{ field: "a" }` for the form. */
function toFieldErrors(errors: ErrorPayload["errors"]): Record<string, string> | undefined {
  if (!errors) return undefined;

  const flattened: Record<string, string> = {};
  for (const [field, value] of Object.entries(errors)) {
    const message = Array.isArray(value) ? value[0] : value;
    if (message) flattened[field] = message;
  }

  return Object.keys(flattened).length > 0 ? flattened : undefined;
}

/**
 * Single entry point for every call to the JGS API.
 *
 * Auth is a bearer token rather than a cookie because the API lives on a
 * different origin from the static site; see `features/admin/auth/session.ts`
 * for the trade-off that implies.
 */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = "GET", body, signal, token, onUnauthorized } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  // A caller-supplied signal still has to win, so the timeout is combined with
  // it rather than replacing it.
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: combined,
    });
  } catch (cause) {
    // The caller aborted deliberately — let that propagate untouched.
    if (signal?.aborted) throw cause;

    if (cause instanceof DOMException && cause.name === "TimeoutError") {
      throw new RepositoryError("network", "Server tidak merespons. Coba lagi.", { cause });
    }
    throw new RepositoryError("network", FALLBACK_MESSAGE.network, { cause });
  }

  if (response.status === 204) return undefined as T;

  const raw = await response.text();
  let payload: unknown = undefined;
  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      // A non-JSON body (an HTML error page from a proxy, say) is handled below.
    }
  }

  if (response.ok) return payload as T;

  const kind: RepositoryErrorKind =
    KIND_BY_STATUS[response.status] ?? (response.status >= 500 ? "server" : "unknown");
  const details = (payload ?? {}) as ErrorPayload;

  if (kind === "unauthorized") onUnauthorized?.();

  throw new RepositoryError(
    kind,
    details.message ?? details.error ?? FALLBACK_MESSAGE[kind],
    { status: response.status, fieldErrors: toFieldErrors(details.errors) },
  );
}
