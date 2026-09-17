import { isBackendConfigured } from "../config";
import { httpApplicationRepository } from "./http-application-repository";
import { httpNotificationRepository } from "./http-notification-repository";
import { httpUserRepository } from "./http-user-repository";
import { httpVehicleRepository } from "./http-vehicle-repository";
import {
  localApplicationRepository,
  localNotificationRepository,
  localUserRepository,
} from "./local-repositories";
import { localVehicleRepository } from "./local-vehicle-repository";
import type {
  ApplicationRepository,
  NotificationRepository,
  UserRepository,
  VehicleRepository,
} from "./types";

/**
 * The one place that decides where the admin's data comes from.
 *
 * Set `NEXT_PUBLIC_API_BASE_URL` and rebuild to move the whole admin onto the
 * AWS API; nothing else in the feature knows which adapter it is talking to.
 */
export const vehicleRepository: VehicleRepository = isBackendConfigured
  ? httpVehicleRepository
  : localVehicleRepository;

export const applicationRepository: ApplicationRepository = isBackendConfigured
  ? httpApplicationRepository
  : localApplicationRepository;

export const userRepository: UserRepository = isBackendConfigured
  ? httpUserRepository
  : localUserRepository;

export const notificationRepository: NotificationRepository = isBackendConfigured
  ? httpNotificationRepository
  : localNotificationRepository;

export { RepositoryError, describeError } from "./types";
export type {
  ApplicationRepository,
  NotificationRepository,
  UserRepository,
  VehicleRepository,
} from "./types";
