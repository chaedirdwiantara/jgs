import type { Vehicle } from "@/data/vehicles";

import type {
  AdminUser,
  ApplicationDetail,
  ApplicationPage,
  ApplicationStatus,
  CreateUserInput,
  ListApplicationsQuery,
  Notification,
  StatusCounts,
  UpdateApplicationInput,
  UpdateUserInput,
} from "../types";

/**
 * The ports the admin UI talks to. Everything above this line is storage
 * agnostic, so moving from browser storage to the AWS API is a matter of
 * swapping the adapters in `index.ts` — no screen has to change.
 */
export interface VehicleRepository {
  list(signal?: AbortSignal): Promise<Vehicle[]>;
  create(vehicle: Vehicle, signal?: AbortSignal): Promise<Vehicle>;
  update(id: string, vehicle: Vehicle, signal?: AbortSignal): Promise<Vehicle>;
  remove(id: string, signal?: AbortSignal): Promise<void>;
}

export interface ApplicationRepository {
  list(query: ListApplicationsQuery, signal?: AbortSignal): Promise<ApplicationPage>;
  counts(signal?: AbortSignal): Promise<StatusCounts>;
  get(id: string, signal?: AbortSignal): Promise<ApplicationDetail>;
  update(id: string, patch: UpdateApplicationInput, signal?: AbortSignal): Promise<void>;
  remove(id: string, signal?: AbortSignal): Promise<void>;
}

export interface UserRepository {
  list(signal?: AbortSignal): Promise<AdminUser[]>;
  create(input: CreateUserInput, signal?: AbortSignal): Promise<AdminUser>;
  update(id: string, patch: UpdateUserInput, signal?: AbortSignal): Promise<AdminUser>;
  remove(id: string, signal?: AbortSignal): Promise<void>;
}

export interface NotificationRepository {
  list(signal?: AbortSignal): Promise<Notification[]>;
  unreadCount(signal?: AbortSignal): Promise<number>;
  markRead(id: string, signal?: AbortSignal): Promise<void>;
  markAllRead(signal?: AbortSignal): Promise<void>;
}

export type { ApplicationStatus };

/*
 * The error vocabulary is shared with the public rental form, so it lives in
 * `@/lib`. Re-exported here because every screen in this feature imports it
 * from the repository barrel.
 */
export {
  describeError,
  RepositoryError,
  type RepositoryErrorKind,
} from "@/lib/api-error";
