/**
 * Fleet catalogue.
 *
 * Rates are the real published price list (daily, monthly, and the downtime
 * charge applied while a unit sits in the workshop after an incident). They are
 * quoted **before PPN** — see `PRICES_EXCLUDE_VAT`.
 *
 * ⚠️ Capacities and range figures are still indicative: they come from the
 * manufacturers' claims, not from measuring our own units. Correct them via
 * `/admin` or here.
 */

export const vehicleTiers = ["economy", "premium", "elite"] as const;

export type VehicleTier = (typeof vehicleTiers)[number];

/** Every rate in this file and in the UI is quoted before tax. */
export const PRICES_EXCLUDE_VAT = true;

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
  /** Daily rate, IDR, before PPN. */
  dailyRate: number;
  /** Monthly rate, IDR, before PPN. Cheaper per day than 30× `dailyRate`. */
  monthlyRate: number;
  /**
   * Charged per day while the unit is off the road for repairs after an
   * incident the renter is responsible for. Published so the figure is visible
   * before booking rather than only in the terms.
   */
  downtimeRate: number;
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

/** Builds the four photo paths from the id, which is how they are named. */
const photosFor = (id: string): Vehicle["photos"] => ({
  outdoor: {
    wide: `/images/fleet/${id}-outdoor-wide.jpg`,
    tall: `/images/fleet/${id}-outdoor-tall.jpg`,
  },
  studio: {
    wide: `/images/fleet/${id}-studio-wide.jpg`,
    tall: `/images/fleet/${id}-studio-tall.jpg`,
  },
});

export const vehicles: Vehicle[] = [
  {
    id: "byd-atto-1",
    name: "BYD ATTO 1",
    tier: "economy",
    seats: 5,
    luggage: 2,
    rangeKm: 300,
    dailyRate: 500_000,
    monthlyRate: 8_000_000,
    downtimeRate: 250_000,
    highlights: ["Lincah di dalam kota", "Parkir mudah", "Konsumsi paling irit"],
    photos: photosFor("byd-atto-1"),
  },
  {
    id: "wuling-cloud",
    name: "Wuling Cloud EV",
    tier: "economy",
    seats: 5,
    luggage: 3,
    rangeKm: 460,
    dailyRate: 700_000,
    monthlyRate: 13_000_000,
    downtimeRate: 400_000,
    highlights: [
      "Kabin lapang dan senyap",
      "Kursi belakang dapat direbahkan",
      "Fast charging",
    ],
    photos: photosFor("wuling-cloud"),
  },
  {
    id: "byd-m6",
    name: "BYD M6",
    tier: "premium",
    seats: 7,
    luggage: 4,
    rangeKm: 530,
    dailyRate: 750_000,
    monthlyRate: 14_000_000,
    downtimeRate: 400_000,
    highlights: ["Tiga baris kursi", "Ideal untuk rombongan", "Bagasi luas"],
    photos: photosFor("byd-m6"),
  },
  {
    id: "hyundai-ioniq-5",
    name: "Hyundai IONIQ 5",
    tier: "premium",
    seats: 5,
    luggage: 3,
    rangeKm: 480,
    dailyRate: 1_800_000,
    monthlyRate: 25_000_000,
    downtimeRate: 800_000,
    highlights: ["Interior premium", "Ruang kaki luas", "Pengisian daya sangat cepat"],
    photos: photosFor("hyundai-ioniq-5"),
  },
  {
    id: "byd-seal",
    name: "BYD Seal",
    tier: "premium",
    seats: 5,
    luggage: 2,
    rangeKm: 550,
    dailyRate: 1_800_000,
    monthlyRate: 25_000_000,
    downtimeRate: 800_000,
    highlights: ["Sedan eksekutif", "Kedap suara", "Jarak tempuh terjauh"],
    photos: photosFor("byd-seal"),
  },
  {
    id: "denza-d9",
    name: "Denza D9",
    tier: "elite",
    seats: 7,
    luggage: 4,
    rangeKm: 600,
    dailyRate: 2_000_000,
    monthlyRate: 36_000_000,
    downtimeRate: 1_000_000,
    highlights: ["Kursi kapten VIP", "Kabin kelas satu", "Pilihan untuk tamu penting"],
    photos: photosFor("denza-d9"),
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

/** Lowest monthly rate — the "mulai dari" figure for the monthly package. */
export function getLowestMonthlyRate(): number {
  return Math.min(...vehicles.map((vehicle) => vehicle.monthlyRate));
}
