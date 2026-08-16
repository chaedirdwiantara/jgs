import { getVehicles, type Vehicle } from "@/data/vehicles";

/**
 * The fleet offered in the booking flow.
 *
 * Today that is simply the whole catalogue — every unit is bookable across the
 * Jabodetabek service area. This function is the seam where real availability
 * (per date, per unit) will be resolved once the backend exposes it, so no
 * screen has to change when it does.
 */
export function getAvailableVehicles(): Vehicle[] {
  return getVehicles();
}

/** Vehicles that can seat at least `minSeats` people. */
export function filterBySeats(vehicles: Vehicle[], minSeats: number): Vehicle[] {
  if (!minSeats) return vehicles;
  return vehicles.filter((vehicle) => vehicle.seats >= minSeats);
}
