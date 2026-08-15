/**
 * Where the admin sends its writes.
 *
 * The public site is a static export (S3/CloudFront), so it has no server of its
 * own — the fleet API is a separate AWS deployment and the admin talks to it
 * directly from the browser. Point this at that API and the admin switches from
 * local mode to live mode with no code change:
 *
 *   NEXT_PUBLIC_API_BASE_URL=https://api.jgs-ev.com
 *
 * `NEXT_PUBLIC_*` values are inlined at build time, so changing this requires a
 * rebuild — that is expected, and it is also why nothing secret may live here.
 */
const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/** Normalised without a trailing slash so callers can always append `/path`. */
export const apiBaseUrl = rawBaseUrl.trim().replace(/\/+$/, "");

/**
 * `false` until the AWS API exists. The admin then keeps working against
 * browser storage so the screens can be used and reviewed — and it says so,
 * loudly, in the UI rather than pretending the data was saved to a server.
 */
export const isBackendConfigured = apiBaseUrl.length > 0;

/** Requests are aborted past this point so the UI can show a real error. */
export const REQUEST_TIMEOUT_MS = 15_000;
