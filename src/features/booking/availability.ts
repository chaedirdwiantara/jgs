import { getLocationById } from "@/data/locations";
import { getVehicles, type Vehicle } from "@/data/vehicles";

/**
 * Vehicles offered at a given service point. Returns an empty list for an
 * unknown location so callers can render an explicit "no unit" state rather
 * than silently falling back to the whole fleet.
 */
export function getVehiclesForLocation(locationId: string): Vehicle[] {
  const location = getLocationById(locationId);
  if (!location) return [];

  const order = new Map(location.vehicleIds.map((id, index) => [id, index]));

  return getVehicles()
    .filter((vehicle) => order.has(vehicle.id))
    .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}

/** Vehicles at `locationId` that can also seat `passengers` people. */
export function filterBySeats(vehicles: Vehicle[], minSeats: number): Vehicle[] {
  if (!minSeats) return vehicles;
  return vehicles.filter((vehicle) => vehicle.seats >= minSeats);
}
