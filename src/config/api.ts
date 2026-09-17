/**
 * Where the browser sends its writes.
 *
 * The site is a static export (Cloudflare Pages), so it has no server of its
 * own — both the public rental form and the admin console call the AWS API
 * directly from the browser. Point this at that API and both switch from local
 * mode to live mode with no code change:
 *
 *   NEXT_PUBLIC_API_BASE_URL=https://xxxxxxxx.execute-api.ap-southeast-1.amazonaws.com
 *
 * `NEXT_PUBLIC_*` values are inlined at build time, so changing this requires a
 * rebuild — that is expected, and it is also why nothing secret may live here.
 *
 * ⚠️ The origin must also be listed in `connect-src` in `public/_headers`, or
 * the browser blocks every call in production with no build-time warning.
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

/** File uploads go straight to S3 and need a far longer budget than an API call. */
export const UPLOAD_TIMEOUT_MS = 120_000;
