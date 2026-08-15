import { getVehicles, type Vehicle } from "@/data/vehicles";

import { RepositoryError, type VehicleRepository } from "./types";

/**
 * Browser-storage stand-in used until `NEXT_PUBLIC_API_BASE_URL` points at the
 * AWS API.
 *
 * It exists so the admin screens are genuinely usable — and reviewable — before
 * the backend lands. It is NOT a data store: everything lives in this browser
 * profile only. The UI states that plainly; see `LocalModeBanner`.
 *
 * It enforces the same invariants the API should (unique id, record must exist)
 * so the screens are exercised against realistic failures rather than a store
 * that always says yes.
 */
const STORAGE_KEY = "jgs.admin.vehicles";

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

function read(): Vehicle[] {
  const store = storage();
  if (!store) return [];

  const raw = store.getItem(STORAGE_KEY);
  // First run: seed from the catalogue the public site is built against, so the
  // admin opens showing the real current fleet.
  if (!raw) return getVehicles().map((vehicle) => ({ ...vehicle }));

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Vehicle[]) : [];
  } catch {
    // Corrupted payload — fall back to the seed rather than trapping the
    // operator on a screen that can never load.
    return getVehicles().map((vehicle) => ({ ...vehicle }));
  }
}

function write(vehicles: Vehicle[]): void {
  const store = storage();
  if (!store) {
    throw new RepositoryError(
      "server",
      "Penyimpanan browser tidak tersedia, perubahan tidak dapat disimpan.",
    );
  }

  try {
    store.setItem(STORAGE_KEY, JSON.stringify(vehicles));
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

export const localVehicleRepository: VehicleRepository = {
  list(signal) {
    return settle(read(), signal);
  },

  create(vehicle, signal) {
    const vehicles = read();
    if (vehicles.some((item) => item.id === vehicle.id)) {
      return Promise.reject(
        new RepositoryError("conflict", `Kode unit "${vehicle.id}" sudah dipakai.`, {
          fieldErrors: { id: "Kode unit sudah dipakai" },
        }),
      );
    }

    write([...vehicles, vehicle]);
    return settle(vehicle, signal);
  },

  update(id, vehicle, signal) {
    const vehicles = read();
    const index = vehicles.findIndex((item) => item.id === id);
    if (index === -1) {
      return Promise.reject(
        new RepositoryError("not-found", "Unit tidak ditemukan, mungkin sudah dihapus."),
      );
    }

    const next = [...vehicles];
    next[index] = vehicle;
    write(next);
    return settle(vehicle, signal);
  },

  remove(id, signal) {
    const vehicles = read();
    if (!vehicles.some((item) => item.id === id)) {
      return Promise.reject(
        new RepositoryError("not-found", "Unit tidak ditemukan, mungkin sudah dihapus."),
      );
    }

    write(vehicles.filter((item) => item.id !== id));
    return settle(undefined, signal);
  },
};

/** Restores the seed catalogue — the escape hatch for local experiments. */
export function resetLocalVehicles(): void {
  storage()?.removeItem(STORAGE_KEY);
}
