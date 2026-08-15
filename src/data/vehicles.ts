/**
 * Fleet catalogue.
 *
 * ⚠️ PLACEHOLDER CATALOGUE — the models are real EVs sold in Indonesia, but the
 * rates, range figures and availability are indicative defaults so the booking
 * flow can be exercised end-to-end. Replace them with the real operational
 * data (or point `getVehicles()` at your API/CMS) before going live.
 *
 * Every price shown in the UI is labelled "mulai dari" and the final amount is
 * always confirmed by admin over WhatsApp — the same model Evista uses.
 */

export const vehicleTiers = ["economy", "premium", "elite"] as const;

export type VehicleTier = (typeof vehicleTiers)[number];

export type Vehicle = {
  id: string;
  name: string;
  tier: VehicleTier;
  /** Seats including driver. */
  seats: number;
  /** Number of medium suitcases that fit in the boot. */
  luggage: number;
  /** Manufacturer-claimed range in km, used as an indicative spec. */
  rangeKm: number;
  /** Indicative daily rate, IDR. */
  dailyRate: number;
  /** Indicative one-way airport transfer rate, IDR. */
  transferRate: number;
  highlights: string[];
  /** Body paint. Drives the colour of the generated illustration. */
  accent: VehicleAccent;
  /**
   * Landscape (16:10) photo of the unit, shown in the home hero carousel.
   *
   * ⚠️ Currently points at a generated placeholder — see
   * `scripts/build-fleet-placeholders.mjs`. Swap in the real photograph at the
   * same path (or any absolute URL) and nothing else has to change.
   */
  photo: string;
};

export const vehicleAccents = ["red", "silver", "graphite", "white"] as const;

export type VehicleAccent = (typeof vehicleAccents)[number];

export const accentLabels: Record<VehicleAccent, string> = {
  red: "Merah",
  silver: "Silver",
  graphite: "Abu-abu gelap",
  white: "Putih",
};

export const vehicles: Vehicle[] = [
  {
    id: "air-ev",
    name: "Wuling Air ev",
    tier: "economy",
    seats: 4,
    luggage: 1,
    rangeKm: 300,
    dailyRate: 450_000,
    transferRate: 275_000,
    highlights: ["Lincah di dalam kota", "Parkir mudah", "Konsumsi paling irit"],
    accent: "white",
    photo: "/images/fleet/air-ev.svg",
  },
  {
    id: "dolphin",
    name: "BYD Dolphin",
    tier: "economy",
    seats: 5,
    luggage: 2,
    rangeKm: 410,
    dailyRate: 750_000,
    transferRate: 350_000,
    highlights: ["Kabin lega untuk 5 orang", "Fast charging", "Fitur keselamatan lengkap"],
    accent: "silver",
    photo: "/images/fleet/dolphin.svg",
  },
  {
    id: "ioniq-5",
    name: "Hyundai IONIQ 5",
    tier: "premium",
    seats: 5,
    luggage: 3,
    rangeKm: 480,
    dailyRate: 1_200_000,
    transferRate: 500_000,
    highlights: ["Interior premium", "Ruang kaki luas", "Pengisian daya sangat cepat"],
    accent: "graphite",
    photo: "/images/fleet/ioniq-5.svg",
  },
  {
    id: "seal",
    name: "BYD Seal",
    tier: "premium",
    seats: 5,
    luggage: 2,
    rangeKm: 550,
    dailyRate: 1_350_000,
    transferRate: 550_000,
    highlights: ["Sedan eksekutif", "Kedap suara", "Jarak tempuh terjauh"],
    accent: "silver",
    photo: "/images/fleet/seal.svg",
  },
  {
    id: "d9",
    name: "Denza D9",
    tier: "elite",
    seats: 7,
    luggage: 4,
    rangeKm: 600,
    dailyRate: 2_500_000,
    transferRate: 950_000,
    highlights: ["Kursi kapten VIP", "Ideal untuk rombongan", "Kenyamanan kelas satu"],
    accent: "red",
    photo: "/images/fleet/d9.svg",
  },
];

export const tierLabels: Record<VehicleTier, string> = {
  economy: "Economy",
  premium: "Premium",
  elite: "Elite",
};

export function getVehicles(): Vehicle[] {
  return vehicles;
}

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((vehicle) => vehicle.id === id);
}

/** Lowest daily rate in the fleet — used for the "mulai dari" headline. */
export function getLowestDailyRate(): number {
  return Math.min(...vehicles.map((vehicle) => vehicle.dailyRate));
}
