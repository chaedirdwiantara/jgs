import type { Vehicle } from "@/data/vehicles";

import { splitHighlights, type VehicleFormValues } from "./schema";

/** Blank form used by "Tambah Mobil". */
export const emptyVehicleForm: VehicleFormValues = {
  id: "",
  name: "",
  tier: "economy",
  seats: 5,
  luggage: 2,
  rangeKm: 400,
  dailyRate: 0,
  monthlyRate: 0,
  downtimeRate: 0,
  highlights: "",
  photoOutdoorWide: "",
  photoOutdoorTall: "",
  photoStudioWide: "",
  photoStudioTall: "",
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
    monthlyRate: values.monthlyRate,
    downtimeRate: values.downtimeRate,
    highlights: splitHighlights(values.highlights),
    photos: {
      outdoor: {
        wide: values.photoOutdoorWide.trim(),
        tall: values.photoOutdoorTall.trim(),
      },
      studio: {
        wide: values.photoStudioWide.trim(),
        tall: values.photoStudioTall.trim(),
      },
    },
  };
}

/** The inverse, for opening the form on an existing unit. */
export function toFormValues(vehicle: Vehicle): VehicleFormValues {
  return {
    id: vehicle.id,
    name: vehicle.name,
    tier: vehicle.tier,
    seats: vehicle.seats,
    luggage: vehicle.luggage,
    rangeKm: vehicle.rangeKm,
    dailyRate: vehicle.dailyRate,
    monthlyRate: vehicle.monthlyRate,
    downtimeRate: vehicle.downtimeRate,
    highlights: vehicle.highlights.join("\n"),
    photoOutdoorWide: vehicle.photos.outdoor.wide,
    photoOutdoorTall: vehicle.photos.outdoor.tall,
    photoStudioWide: vehicle.photos.studio.wide,
    photoStudioTall: vehicle.photos.studio.tall,
  };
}
