import { z } from "zod";

import { vehicleTiers } from "@/data/vehicles";

/** Lowercase slug — it is the vehicle's primary key and appears in URLs. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Accepts a site-relative path (`/images/fleet/byd-m6-studio-wide.jpg`) or an
 * absolute https URL, so photos can be served from `public/` today and from S3
 * later.
 */
const photo = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} wajib diisi`)
    .max(500, `Alamat ${label.toLowerCase()} terlalu panjang`)
    .refine(
      (value) => value.startsWith("/") || /^https:\/\/\S+$/.test(value),
      "Gunakan path yang diawali / atau URL https://",
    );

const rupiah = (label: string, max: number) =>
  z
    .number({ error: `${label} wajib diisi` })
    .int(`${label} harus berupa angka bulat`)
    .min(0, `${label} tidak boleh negatif`)
    .max(max, `${label} melebihi batas wajar`);

const count = (label: string, min: number, max: number) =>
  z
    .number({ error: `${label} wajib diisi` })
    .int(`${label} harus berupa angka bulat`)
    .min(min, `${label} minimal ${min}`)
    .max(max, `${label} maksimal ${max}`);

export const vehicleFormSchema = z.object({
  id: z
    .string()
    .trim()
    .min(2, "Kode unit minimal 2 karakter")
    .max(40, "Kode unit maksimal 40 karakter")
    .regex(SLUG, "Gunakan huruf kecil, angka, dan tanda hubung. Contoh: byd-seal"),

  name: z
    .string()
    .trim()
    .min(2, "Nama mobil minimal 2 karakter")
    .max(60, "Nama mobil maksimal 60 karakter"),

  tier: z.enum(vehicleTiers, { error: "Pilih kelas armada" }),

  seats: count("Kapasitas kursi", 1, 12),
  luggage: count("Kapasitas bagasi", 0, 12),
  rangeKm: count("Jarak tempuh", 50, 1500),

  dailyRate: rupiah("Tarif harian", 100_000_000),

  /*
   * Entered as one line per point. Kept as a string in form state — an array
   * field would need `useFieldArray` for what is genuinely a textarea.
   */
  highlights: z
    .string()
    .trim()
    .min(1, "Isi minimal satu keunggulan")
    .refine(
      (value) => splitHighlights(value).length > 0,
      "Isi minimal satu keunggulan",
    )
    .refine(
      (value) => splitHighlights(value).length <= 5,
      "Maksimal 5 keunggulan agar kartu armada tetap rapi",
    )
    .refine(
      (value) => splitHighlights(value).every((line) => line.length <= 80),
      "Setiap keunggulan maksimal 80 karakter",
    ),

  /*
   * Four separate URLs rather than one: each unit has an on-location and a
   * studio scene, and each of those has a landscape and a portrait master that
   * `FleetPhoto` swaps between at the `sm` breakpoint.
   */
  photoOutdoorWide: photo("Foto luar ruangan (lebar)"),
  photoOutdoorTall: photo("Foto luar ruangan (tinggi)"),
  photoStudioWide: photo("Foto studio (lebar)"),
  photoStudioTall: photo("Foto studio (tinggi)"),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

/** One highlight per line, blank lines discarded. */
export function splitHighlights(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Turns a model name into a candidate slug, e.g. "BYD Seal" → "byd-seal". */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents left by NFD
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}
