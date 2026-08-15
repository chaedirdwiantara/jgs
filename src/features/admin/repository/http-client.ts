import { apiBaseUrl, REQUEST_TIMEOUT_MS } from "../config";
import { clearToken, readToken } from "../auth/session";
import { RepositoryError, type RepositoryErrorKind } from "./types";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  /** Login has no token yet, and a 401 there means "wrong password". */
  skipAuth?: boolean;
};

/** Error envelope the API is expected to return: `{ message, errors? }`. */
type ErrorPayload = {
  message?: string;
  error?: string;
  errors?: Record<string, string | string[]>;
};

const KIND_BY_STATUS: Record<number, RepositoryErrorKind> = {
  400: "validation",
  401: "unauthorized",
  403: "unauthorized",
  404: "not-found",
  409: "conflict",
  422: "validation",
};

const FALLBACK_MESSAGE: Record<RepositoryErrorKind, string> = {
  network: "Tidak dapat terhubung ke server. Periksa koneksi Anda.",
  unauthorized: "Sesi Anda berakhir. Silakan masuk kembali.",
  validation: "Data yang dikirim ditolak server.",
  conflict: "Data bentrok dengan yang sudah ada di server.",
  "not-found": "Data tidak ditemukan di server.",
  server: "Server sedang bermasalah. Coba lagi beberapa saat lagi.",
  unknown: "Terjadi kesalahan tak terduga.",
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
 * Single entry point for every call to the fleet API.
 *
 * Auth is a bearer token rather than a cookie because the API lives on a
 * different origin from the static site; see `auth/session.ts` for the
 * trade-off that implies.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, signal, skipAuth = false } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (!skipAuth) {
    const token = readToken();
    if (!token) {
      throw new RepositoryError("unauthorized", FALLBACK_MESSAGE.unauthorized);
    }
    headers.Authorization = `Bearer ${token}`;
  }

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

  const kind =
    KIND_BY_STATUS[response.status] ?? (response.status >= 500 ? "server" : "unknown");
  const details = (payload ?? {}) as ErrorPayload;

  // An expired token is useless — drop it so the UI falls back to the login form.
  if (kind === "unauthorized") clearToken();

  throw new RepositoryError(
    kind,
    details.message ?? details.error ?? FALLBACK_MESSAGE[kind],
    { status: response.status, fieldErrors: toFieldErrors(details.errors) },
  );
}
