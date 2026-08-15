import { isBackendConfigured } from "../config";
import { httpVehicleRepository } from "./http-vehicle-repository";
import { localVehicleRepository } from "./local-vehicle-repository";
import type { VehicleRepository } from "./types";

/**
 * The one place that decides where the admin's data comes from.
 *
 * Set `NEXT_PUBLIC_API_BASE_URL` and rebuild to move the whole admin onto the
 * AWS API; nothing else in the feature knows which adapter it is talking to.
 */
export const vehicleRepository: VehicleRepository = isBackendConfigured
  ? httpVehicleRepository
  : localVehicleRepository;

export { RepositoryError, describeError } from "./types";
export type { VehicleRepository } from "./types";
