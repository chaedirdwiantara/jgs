/**
 * One error type for every call to the AWS API, whether it came from the public
 * rental form or the admin console, and whether the adapter behind it was HTTP
 * or browser storage. Screens never branch on which.
 */
export type RepositoryErrorKind =
  /** The request never reached the API (offline, DNS, CORS). */
  | "network"
  /** Token missing, expired, or rejected. */
  | "unauthorized"
  /** The API rejected the payload — `fieldErrors` may carry the details. */
  | "validation"
  /** Slug already taken, or the record vanished between read and write. */
  | "conflict"
  | "not-found"
  /** Too many requests from this client; back off and retry later. */
  | "rate-limited"
  | "server"
  | "unknown";

export class RepositoryError extends Error {
  readonly kind: RepositoryErrorKind;
  readonly status?: number;
  /** Server-side, per-field messages keyed by form field name. */
  readonly fieldErrors?: Record<string, string>;
  /** For `rate-limited`: the API's `Retry-After`, in seconds, when it sent one. */
  readonly retryAfterSeconds?: number;

  constructor(
    kind: RepositoryErrorKind,
    message: string,
    options: {
      status?: number;
      fieldErrors?: Record<string, string>;
      retryAfterSeconds?: number;
      cause?: unknown;
    } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "RepositoryError";
    this.kind = kind;
    this.status = options.status;
    this.fieldErrors = options.fieldErrors;
    this.retryAfterSeconds = options.retryAfterSeconds;
  }
}

export const FALLBACK_MESSAGE: Record<RepositoryErrorKind, string> = {
  network: "Tidak dapat terhubung ke server. Periksa koneksi Anda.",
  unauthorized: "Sesi Anda berakhir. Silakan masuk kembali.",
  validation: "Data yang dikirim ditolak server.",
  conflict: "Data bentrok dengan yang sudah ada di server.",
  "not-found": "Data tidak ditemukan di server.",
  "rate-limited": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi.",
  server: "Server sedang bermasalah. Coba lagi beberapa saat lagi.",
  unknown: "Terjadi kesalahan tak terduga.",
};

export const KIND_BY_STATUS: Record<number, RepositoryErrorKind> = {
  400: "validation",
  401: "unauthorized",
  403: "unauthorized",
  404: "not-found",
  409: "conflict",
  422: "validation",
  429: "rate-limited",
};

/** Indonesian copy for each failure mode, shown directly to the operator. */
export function describeError(error: unknown): string {
  if (error instanceof RepositoryError) return error.message;
  if (error instanceof DOMException && error.name === "AbortError") {
    return "Permintaan dibatalkan.";
  }
  return "Terjadi kesalahan tak terduga. Coba lagi.";
}
