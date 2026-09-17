import type {
  ApplicationDetail,
  ApplicationPage,
  ListApplicationsQuery,
  StatusCounts,
  UpdateApplicationInput,
} from "../types";
import { apiRequest } from "./http-client";
import type { ApplicationRepository } from "./types";

/**
 * Adapter for the rental-application inbox.
 *
 *   GET    /applications?status&limit&cursor → { items, nextCursor }
 *   GET    /applications/summary            → { counts }
 *   GET    /applications/:id                → { application }
 *   PATCH  /applications/:id                → 204
 *   DELETE /applications/:id                → 204  (owner only)
 */
export const httpApplicationRepository: ApplicationRepository = {
  list(query, signal) {
    const params = new URLSearchParams();
    if (query.status) params.set("status", query.status);
    if (query.limit) params.set("limit", String(query.limit));
    if (query.cursor) params.set("cursor", query.cursor);

    const suffix = params.size > 0 ? `?${params.toString()}` : "";
    return apiRequest<ApplicationPage>(`/applications${suffix}`, { signal });
  },

  async counts(signal) {
    const payload = await apiRequest<{ counts: StatusCounts }>("/applications/summary", {
      signal,
    });
    return payload.counts;
  },

  async get(id, signal) {
    const payload = await apiRequest<{ application: ApplicationDetail }>(
      `/applications/${encodeURIComponent(id)}`,
      { signal },
    );
    return payload.application;
  },

  async update(id, patch: UpdateApplicationInput, signal) {
    await apiRequest<void>(`/applications/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: patch,
      signal,
    });
  },

  async remove(id, signal) {
    await apiRequest<void>(`/applications/${encodeURIComponent(id)}`, {
      method: "DELETE",
      signal,
    });
  },
};

export type { ListApplicationsQuery };
