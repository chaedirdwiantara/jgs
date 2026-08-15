/**
 * Fleet catalogue.
 *
 * ⚠️ PLACEHOLDER FIGURES — the three units and their photography are real, but
 * the rates, capacities and range figures below are indicative defaults so the
 * booking flow can be exercised end-to-end. Replace them with the real
 * operational data — via `/admin`, or by editing this file — before going live.
 *
 * Every price shown in the UI is labelled "mulai dari" and the final amount is
 * always confirmed by admin over WhatsApp.
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
  /**
   * Two scenes, each in two shapes. `FleetPhoto` picks the shape by viewport:
   * `wide` from 640px up, `tall` on phones.
   *
   * `outdoor` fronts the home hero; `studio` runs the armada catalogue, the
   * booking picker and the admin list. Regenerate with `npm run build:fleet`
   * after adding masters to `assets/fleet/`.
   */
  photos: {
    outdoor: FleetPhotoPair;
    studio: FleetPhotoPair;
  };
};

export type FleetPhotoPair = {
  /** Landscape master, for frames wider than they are tall. */
  wide: string;
  /** Portrait master (same shot, blurred fill top and bottom). */
  tall: string;
};

export const vehicles: Vehicle[] = [
  {
    id: "byd-atto-1",
    name: "BYD ATTO 1",
    tier: "economy",
    seats: 5,
    luggage: 2,
    rangeKm: 300,
    dailyRate: 450_000,
    transferRate: 275_000,
    highlights: ["Lincah di dalam kota", "Parkir mudah", "Konsumsi paling irit"],
    photos: {
      outdoor: {
        wide: "/images/fleet/byd-atto-1-outdoor-wide.jpg",
        tall: "/images/fleet/byd-atto-1-outdoor-tall.jpg",
      },
      studio: {
        wide: "/images/fleet/byd-atto-1-studio-wide.jpg",
        tall: "/images/fleet/byd-atto-1-studio-tall.jpg",
      },
    },
  },
  {
    id: "wuling-cloud",
    name: "Wuling Cloud EV",
    tier: "premium",
    seats: 5,
    luggage: 3,
    rangeKm: 460,
    dailyRate: 750_000,
    transferRate: 350_000,
    highlights: [
      "Kabin lapang dan senyap",
      "Kursi belakang dapat direbahkan",
      "Fast charging",
    ],
    photos: {
      outdoor: {
        wide: "/images/fleet/wuling-cloud-outdoor-wide.jpg",
        tall: "/images/fleet/wuling-cloud-outdoor-tall.jpg",
      },
      studio: {
        wide: "/images/fleet/wuling-cloud-studio-wide.jpg",
        tall: "/images/fleet/wuling-cloud-studio-tall.jpg",
      },
    },
  },
  {
    id: "byd-m6",
    name: "BYD M6",
    tier: "elite",
    seats: 7,
    luggage: 4,
    rangeKm: 530,
    dailyRate: 1_200_000,
    transferRate: 500_000,
    highlights: ["Tiga baris kursi", "Ideal untuk rombongan", "Kenyamanan kelas satu"],
    photos: {
      outdoor: {
        wide: "/images/fleet/byd-m6-outdoor-wide.jpg",
        tall: "/images/fleet/byd-m6-outdoor-tall.jpg",
      },
      studio: {
        wide: "/images/fleet/byd-m6-studio-wide.jpg",
        tall: "/images/fleet/byd-m6-studio-tall.jpg",
      },
    },
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
