/**
 * Service points (pool / titik jemput).
 *
 * ⚠️ PLACEHOLDER CATALOGUE — replace with the real operational pool list.
 * Kept as plain data so it can later be swapped for a CMS or API response
 * without touching any component: only `getLocations()` would change.
 */

/** Indonesian time-zone abbreviations shown next to a pickup time. */
export type TimeZoneLabel = "WIB" | "WITA" | "WIT";

export type Location = {
  /** Stable slug used in form values and query strings. */
  id: string;
  name: string;
  /** City / area label shown as secondary text. */
  area: string;
  /**
   * Local time zone. A pickup time entered for Bali means WITA, not WIB —
   * labelling every time "WIB" would send the driver an hour late.
   */
  timeZoneLabel: TimeZoneLabel;
  /** Vehicle ids available at this location. */
  vehicleIds: string[];
};

export const locations: Location[] = [
  {
    id: "soetta",
    name: "Bandara Soekarno-Hatta",
    area: "Tangerang, Banten",
    timeZoneLabel: "WIB",
    vehicleIds: ["air-ev", "dolphin", "ioniq-5", "seal", "d9"],
  },
  {
    id: "halim",
    name: "Bandara Halim Perdanakusuma",
    area: "Jakarta Timur",
    timeZoneLabel: "WIB",
    vehicleIds: ["air-ev", "dolphin", "ioniq-5", "d9"],
  },
  {
    id: "jakarta-selatan",
    name: "Pool Jakarta Selatan",
    area: "Jakarta Selatan",
    timeZoneLabel: "WIB",
    vehicleIds: ["air-ev", "dolphin", "ioniq-5", "seal", "d9"],
  },
  {
    id: "juanda",
    name: "Bandara Juanda",
    area: "Surabaya, Jawa Timur",
    timeZoneLabel: "WIB",
    vehicleIds: ["air-ev", "dolphin", "ioniq-5"],
  },
  {
    id: "ngurah-rai",
    name: "Bandara I Gusti Ngurah Rai",
    area: "Badung, Bali",
    timeZoneLabel: "WITA",
    vehicleIds: ["air-ev", "dolphin", "seal", "d9"],
  },
];

export function getLocations(): Location[] {
  return locations;
}

export function getLocationById(id: string): Location | undefined {
  return locations.find((location) => location.id === id);
}
