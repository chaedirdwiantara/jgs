import type { Notification } from "../types";
import { apiRequest } from "./http-client";
import type { NotificationRepository } from "./types";

/**
 * Adapter for the bell.
 *
 *   GET  /notifications              → { items }
 *   GET  /notifications/unread-count → { unread }
 *   POST /notifications/:id/read     → 204
 *   POST /notifications/read-all     → 204
 *
 * The site is a static export, so there is no socket to push on — the badge is
 * polled. `unread-count` is a counting query on the server precisely so that
 * polling it stays cheap.
 */
export const httpNotificationRepository: NotificationRepository = {
  async list(signal) {
    const payload = await apiRequest<{ items: Notification[] }>("/notifications", { signal });
    return payload.items ?? [];
  },

  async unreadCount(signal) {
    const payload = await apiRequest<{ unread: number }>("/notifications/unread-count", {
      signal,
    });
    return payload.unread ?? 0;
  },

  async markRead(id, signal) {
    await apiRequest<void>(`/notifications/${encodeURIComponent(id)}/read`, {
      method: "POST",
      signal,
    });
  },

  async markAllRead(signal) {
    await apiRequest<void>("/notifications/read-all", { method: "POST", signal });
  },
};
