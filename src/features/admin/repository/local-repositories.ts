import { RepositoryError } from "@/lib/api-error";

import type { AdminUser, ApplicationDetail, Notification } from "../types";
import type {
  ApplicationRepository,
  NotificationRepository,
  UserRepository,
} from "./types";

/**
 * Browser-storage stand-ins used until `NEXT_PUBLIC_API_BASE_URL` points at the
 * AWS API — the same arrangement `local-vehicle-repository.ts` makes for the
 * fleet, and for the same reason: the screens must be usable and reviewable
 * before the backend exists.
 *
 * These are NOT a data store. Everything lives in this browser profile only,
 * and `LocalModeBanner` says so on every screen that uses them.
 *
 * Rental applications are never seeded with fake examples: an inbox showing
 * invented renters is a screen someone will eventually act on.
 */
const APPLICATIONS_KEY = "jgs.admin.applications";
const USERS_KEY = "jgs.admin.users";
const NOTIFICATIONS_KEY = "jgs.admin.notifications";

/** Enough delay to exercise the loading states, short enough not to annoy. */
const LATENCY_MS = 180;

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function read<T>(key: string, fallback: T): T {
  const raw = storage()?.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  const store = storage();
  if (!store) {
    throw new RepositoryError(
      "server",
      "Penyimpanan browser tidak tersedia, perubahan tidak dapat disimpan.",
    );
  }

  try {
    store.setItem(key, JSON.stringify(value));
  } catch (cause) {
    throw new RepositoryError("server", "Penyimpanan browser penuh.", { cause });
  }
}

const settle = <T,>(value: T, signal?: AbortSignal): Promise<T> =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(value), LATENCY_MS);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });

export const localApplicationRepository: ApplicationRepository = {
  list(_query, signal) {
    const items = read<ApplicationDetail[]>(APPLICATIONS_KEY, []);
    return settle({ items, nextCursor: null }, signal);
  },

  counts(signal) {
    const items = read<ApplicationDetail[]>(APPLICATIONS_KEY, []);
    return settle(
      {
        baru: items.filter((item) => item.status === "baru").length,
        diproses: items.filter((item) => item.status === "diproses").length,
        disetujui: items.filter((item) => item.status === "disetujui").length,
        ditolak: items.filter((item) => item.status === "ditolak").length,
      },
      signal,
    );
  },

  get(id, signal) {
    const found = read<ApplicationDetail[]>(APPLICATIONS_KEY, []).find(
      (item) => item.id === id,
    );
    if (!found) {
      return Promise.reject(new RepositoryError("not-found", "Pengajuan tidak ditemukan."));
    }
    return settle(found, signal);
  },

  update(id, patch, signal) {
    const items = read<ApplicationDetail[]>(APPLICATIONS_KEY, []);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      return Promise.reject(new RepositoryError("not-found", "Pengajuan tidak ditemukan."));
    }

    const next = [...items];
    next[index] = { ...items[index]!, ...patch, updatedAt: new Date().toISOString() };
    write(APPLICATIONS_KEY, next);
    return settle(undefined, signal);
  },

  remove(id, signal) {
    const items = read<ApplicationDetail[]>(APPLICATIONS_KEY, []);
    write(
      APPLICATIONS_KEY,
      items.filter((item) => item.id !== id),
    );
    return settle(undefined, signal);
  },
};

/**
 * Seeded with the account someone would obviously create first, so the screen
 * shows its real layout instead of an empty state that hides every column.
 */
function seedUsers(): AdminUser[] {
  const now = new Date().toISOString();
  return [
    {
      id: "local-owner",
      email: "admin@jgs-ev.com",
      name: "Pemilik (contoh lokal)",
      role: "owner",
      isActive: true,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
    },
  ];
}

export const localUserRepository: UserRepository = {
  list(signal) {
    return settle(read<AdminUser[]>(USERS_KEY, seedUsers()), signal);
  },

  create(input, signal) {
    const users = read<AdminUser[]>(USERS_KEY, seedUsers());
    const email = input.email.trim().toLowerCase();

    if (users.some((user) => user.email === email)) {
      return Promise.reject(
        new RepositoryError("conflict", "Email ini sudah terdaftar.", {
          fieldErrors: { email: "Email ini sudah terdaftar." },
        }),
      );
    }

    const now = new Date().toISOString();
    const created: AdminUser = {
      id: `local-${crypto.randomUUID()}`,
      email,
      name: input.name.trim(),
      role: input.role,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
    };

    write(USERS_KEY, [...users, created]);
    return settle(created, signal);
  },

  update(id, patch, signal) {
    const users = read<AdminUser[]>(USERS_KEY, seedUsers());
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      return Promise.reject(new RepositoryError("not-found", "Pengguna tidak ditemukan."));
    }

    // `password` is deliberately ignored: there is nothing here to
    // authenticate against, so storing it would only put a secret in
    // localStorage for no benefit.
    const updated: AdminUser = {
      ...users[index]!,
      ...(patch.name !== undefined ? { name: patch.name } : {}),
      ...(patch.role !== undefined ? { role: patch.role } : {}),
      ...(patch.isActive !== undefined ? { isActive: patch.isActive } : {}),
      updatedAt: new Date().toISOString(),
    };

    const next = [...users];
    next[index] = updated;
    write(USERS_KEY, next);
    return settle(updated, signal);
  },

  remove(id, signal) {
    const users = read<AdminUser[]>(USERS_KEY, seedUsers());
    write(
      USERS_KEY,
      users.filter((user) => user.id !== id),
    );
    return settle(undefined, signal);
  },
};

export const localNotificationRepository: NotificationRepository = {
  list(signal) {
    return settle(read<Notification[]>(NOTIFICATIONS_KEY, []), signal);
  },

  unreadCount(signal) {
    const items = read<Notification[]>(NOTIFICATIONS_KEY, []);
    return settle(items.filter((item) => item.readAt === null).length, signal);
  },

  markRead(id, signal) {
    const items = read<Notification[]>(NOTIFICATIONS_KEY, []);
    write(
      NOTIFICATIONS_KEY,
      items.map((item) =>
        item.id === id ? { ...item, readAt: new Date().toISOString() } : item,
      ),
    );
    return settle(undefined, signal);
  },

  markAllRead(signal) {
    const items = read<Notification[]>(NOTIFICATIONS_KEY, []);
    const readAt = new Date().toISOString();
    write(
      NOTIFICATIONS_KEY,
      items.map((item) => (item.readAt ? item : { ...item, readAt })),
    );
    return settle(undefined, signal);
  },
};
