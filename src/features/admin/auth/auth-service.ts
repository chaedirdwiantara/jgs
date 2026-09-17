import { apiRequest } from "../repository/http-client";
import { RepositoryError } from "../repository/types";
import type { AdminUser } from "../types";
import { clearToken, writeSession } from "./session";

type LoginResponse = {
  /** Either name is accepted so the backend can use its house convention. */
  token?: string;
  accessToken?: string;
  user?: AdminUser;
};

export type Credentials = {
  email: string;
  password: string;
};

/**
 * Exchanges credentials for a bearer token.
 *
 * Contract: `POST /auth/login` → `{ token, expiresAt, user }`, `401` on bad
 * credentials. The password never leaves this call — nothing persists it.
 */
export async function signIn({ email, password }: Credentials): Promise<void> {
  const payload = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
    // No token exists yet, and a 401 here means "wrong credentials" rather
    // than "session expired".
    skipAuth: true,
  });

  const token = payload?.token ?? payload?.accessToken;
  if (!token) {
    throw new RepositoryError("server", "Server tidak mengirimkan token sesi.");
  }

  writeSession(token, payload?.user ?? null);
}

export function signOut(): void {
  clearToken();
}

/** Self-service password change for the signed-in operator. */
export async function changeOwnPassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await apiRequest<void>("/auth/password", { method: "POST", body: input });
}
