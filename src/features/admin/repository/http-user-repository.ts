import type { AdminUser } from "../types";
import { apiRequest } from "./http-client";
import type { UserRepository } from "./types";

/**
 * Adapter for console accounts. Every route is owner-only server-side; the UI
 * hides them from staff as a courtesy, not as the control.
 *
 *   GET    /users      → { items }
 *   POST   /users      → { user }  (409 when the email is taken)
 *   PATCH  /users/:id  → { user }
 *   DELETE /users/:id  → 204
 */
export const httpUserRepository: UserRepository = {
  async list(signal) {
    const payload = await apiRequest<{ items: AdminUser[] }>("/users", { signal });
    return payload.items ?? [];
  },

  async create(input, signal) {
    const payload = await apiRequest<{ user: AdminUser }>("/users", {
      method: "POST",
      body: input,
      signal,
    });
    return payload.user;
  },

  async update(id, patch, signal) {
    const payload = await apiRequest<{ user: AdminUser }>(`/users/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: patch,
      signal,
    });
    return payload.user;
  },

  async remove(id, signal) {
    await apiRequest<void>(`/users/${encodeURIComponent(id)}`, { method: "DELETE", signal });
  },
};
