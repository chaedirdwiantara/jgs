import type { Vehicle } from "@/data/vehicles";

/**
 * The port the admin UI talks to. Everything above this line is storage
 * agnostic, so moving from browser storage to the AWS API is a matter of
 * swapping the adapter in `index.ts` — no screen has to change.
 */
export interface VehicleRepository {
  list(signal?: AbortSignal): Promise<Vehicle[]>;
  create(vehicle: Vehicle, signal?: AbortSignal): Promise<Vehicle>;
  update(id: string, vehicle: Vehicle, signal?: AbortSignal): Promise<Vehicle>;
  remove(id: string, signal?: AbortSignal): Promise<void>;
}

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
  | "server"
  | "unknown";

/**
 * One error type for both adapters, so the UI never branches on which storage
 * is behind it.
 */
export class RepositoryError extends Error {
  readonly kind: RepositoryErrorKind;
  readonly status?: number;
  /** Server-side, per-field messages keyed by form field name. */
  readonly fieldErrors?: Record<string, string>;

  constructor(
    kind: RepositoryErrorKind,
    message: string,
    options: { status?: number; fieldErrors?: Record<string, string>; cause?: unknown } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "RepositoryError";
    this.kind = kind;
    this.status = options.status;
    this.fieldErrors = options.fieldErrors;
  }
}

/** Indonesian copy for each failure mode, shown directly to the operator. */
export function describeError(error: unknown): string {
  if (error instanceof RepositoryError) return error.message;
  if (error instanceof DOMException && error.name === "AbortError") {
    return "Permintaan dibatalkan.";
  }
  return "Terjadi kesalahan tak terduga. Coba lagi.";
}
