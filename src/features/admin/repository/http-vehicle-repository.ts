import type { Vehicle } from "@/data/vehicles";

import { apiRequest } from "./http-client";
import type { VehicleRepository } from "./types";

/**
 * Adapter for the fleet API on AWS.
 *
 * Expected contract — implement these five on the backend and the admin works
 * as-is:
 *
 *   GET    /vehicles        → { data: Vehicle[] } | Vehicle[]
 *   POST   /vehicles        → Vehicle            (409 if the id is taken)
 *   PUT    /vehicles/:id    → Vehicle
 *   DELETE /vehicles/:id    → 204
 *
 * Errors should come back as `{ message, errors?: { field: string } }`; the
 * client maps `errors` onto the matching form fields.
 */
export const httpVehicleRepository: VehicleRepository = {
  async list(signal) {
    const payload = await apiRequest<Vehicle[] | { data: Vehicle[] }>("/vehicles", { signal });
    // Tolerate both a bare array and the common `{ data: [...] }` envelope so
    // the backend is not forced into one convention.
    return Array.isArray(payload) ? payload : (payload?.data ?? []);
  },

  create(vehicle, signal) {
    return apiRequest<Vehicle>("/vehicles", { method: "POST", body: vehicle, signal });
  },

  update(id, vehicle, signal) {
    return apiRequest<Vehicle>(`/vehicles/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: vehicle,
      signal,
    });
  },

  async remove(id, signal) {
    await apiRequest<void>(`/vehicles/${encodeURIComponent(id)}`, {
      method: "DELETE",
      signal,
    });
  },
};
