/**
 * The admin talks to the same API as the public rental form, so the settings
 * live in `@/config/api` and this module only re-exports them.
 *
 * Kept as a file rather than deleted: every screen in this feature imports from
 * here, and the indirection is what stops the public form from having to reach
 * into `features/admin` for a URL.
 */
export { apiBaseUrl, isBackendConfigured, REQUEST_TIMEOUT_MS } from "@/config/api";
