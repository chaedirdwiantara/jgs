import { apiRequest as call, type ApiRequestOptions } from "@/lib/api-client";
import { FALLBACK_MESSAGE, RepositoryError } from "@/lib/api-error";

import { clearToken, readToken } from "../auth/session";

type RequestOptions = Omit<ApiRequestOptions, "token" | "onUnauthorized"> & {
  /** Login has no token yet, and a 401 there means "wrong password". */
  skipAuth?: boolean;
};

/**
 * The console's view of `@/lib/api-client`: same transport, plus the session.
 *
 * Every authenticated call attaches the stored token, and an expired one is
 * dropped the moment the API rejects it — which is what makes the console fall
 * back to the login form instead of looping on 401s.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth = false, ...rest } = options;

  if (skipAuth) return call<T>(path, rest);

  const token = readToken();
  if (!token) {
    throw new RepositoryError("unauthorized", FALLBACK_MESSAGE.unauthorized);
  }

  return call<T>(path, { ...rest, token, onUnauthorized: clearToken });
}
