import type { Vehicle } from "@/data/vehicles";

import { splitHighlights, type VehicleFormValues } from "./schema";

/** Blank form used by "Tambah Mobil". */
export const emptyVehicleForm: VehicleFormValues = {
  id: "",
  name: "",
  tier: "economy",
  accent: "white",
  seats: 5,
  luggage: 2,
  rangeKm: 400,
  dailyRate: 0,
  transferRate: 0,
  highlights: "",
  photo: "",
};

/** Form state → the shape the catalogue and the API speak. */
export function toVehicle(values: VehicleFormValues): Vehicle {
  return {
    id: values.id.trim(),
    name: values.name.trim(),
    tier: values.tier,
    seats: values.seats,
    luggage: values.luggage,
    rangeKm: values.rangeKm,
    dailyRate: values.dailyRate,
    transferRate: values.transferRate,
    highlights: splitHighlights(values.highlights),
    accent: values.accent,
    photo: values.photo.trim(),
  };
}

/** The inverse, for opening the form on an existing unit. */
export function toFormValues(vehicle: Vehicle): VehicleFormValues {
  return {
    id: vehicle.id,
    name: vehicle.name,
    tier: vehicle.tier,
    accent: vehicle.accent,
    seats: vehicle.seats,
    luggage: vehicle.luggage,
    rangeKm: vehicle.rangeKm,
    dailyRate: vehicle.dailyRate,
    transferRate: vehicle.transferRate,
    highlights: vehicle.highlights.join("\n"),
    photo: vehicle.photo,
  };
}
