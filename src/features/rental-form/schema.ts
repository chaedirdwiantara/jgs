import { z } from "zod";

import { OTHER_OPTION, socialProfileUrl } from "@/data/rental-form-options";
import { todayISO, toWhatsAppNumber } from "@/lib/format";

/**
 * Client-side mirror of the API's `submitApplicationSchema`.
 *
 * It exists to give an answer without a round trip, not to be the authority —
 * the API validates everything again and its `errors` map is what wins when the
 * two disagree.
 */

const phone = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} wajib diisi`)
    .refine(
      // `toWhatsAppNumber` is the site's existing normaliser: `0811…`,
      // `+62811…`, `62 811…` and `811…` all end up as `62811…`, which is the
      // one shape the API accepts.
      (value) => /^62\d{8,13}$/.test(toWhatsAppNumber(value)),
      `${label} tidak valid. Contoh: 0811803090`,
    );

const text = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, min === 1 ? `${label} wajib diisi` : `${label} minimal ${min} karakter`)
    .max(max, `${label} maksimal ${max} karakter`);

/** A year out is well past any booking this business takes. */
export function maxStartDate(): string {
  const limit = new Date();
  limit.setFullYear(limit.getFullYear() + 1);
  return limit.toISOString().slice(0, 10);
}

export const MIN_DURATION_DAYS = 1;
export const MAX_DURATION_DAYS = 90;

export const rentalFormSchema = z
  .object({
    /* Langkah 1 — data penyewa */
    email: z
      .string()
      .trim()
      .min(1, "Email wajib diisi")
      .pipe(z.email("Format email tidak valid")),
    fullName: text("Nama lengkap", 2, 120),
    address: text("Alamat tinggal", 5, 400),
    whatsapp: phone("Nomor WhatsApp"),
    gsmNumber: phone("Nomor GSM"),
    emergencyNumber: phone("Nomor darurat"),
    socialPlatform: z.string().min(1, "Pilih platform media sosial"),
    /* A profile link or a bare username — see `socialProfileUrl`. */
    socialAccount: text("Akun media sosial", 2, 200).refine(
      (value) => !/\s/.test(value),
      "Tulis tautan profil atau username saja, tanpa spasi",
    ),

    /* Langkah 2 — detail sewa */
    purpose: text("Tujuan menyewa mobil", 2, 300),
    usageLocation: text("Lokasi penggunaan mobil", 2, 300),
    startDate: z
      .string()
      .min(1, "Tanggal penyewaan wajib diisi")
      .refine((value) => value >= todayISO(), "Tanggal tidak boleh di masa lalu")
      .refine((value) => value <= maxStartDate(), "Tanggal terlalu jauh ke depan"),
    startTime: z
      .string()
      .min(1, "Jam mulai sewa wajib diisi")
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Jam mulai sewa tidak valid"),
    durationDays: z.coerce
      .number({ error: "Durasi penyewaan wajib diisi" })
      .int("Durasi harus berupa angka bulat")
      .min(MIN_DURATION_DAYS, `Durasi minimal ${MIN_DURATION_DAYS} hari`)
      .max(MAX_DURATION_DAYS, `Durasi maksimal ${MAX_DURATION_DAYS} hari`),
    vehicleChoice: z.string().min(1, "Pilih jenis mobil"),
    vehicleOther: z.string().trim().max(80, "Maksimal 80 karakter"),
    driver: z.enum(["ya", "tidak"], { error: "Pilih dengan atau tanpa driver" }),
    referralSource: z.string().min(1, "Pilih dari mana Anda mengetahui JGS"),
    referralSourceOther: z.string().trim().max(80, "Maksimal 80 karakter"),

    /* Langkah 4 — persetujuan */
    agreement: z.literal(true, {
      error: "Anda harus menyetujui peraturan sewa untuk melanjutkan",
    }),

    /** Hidden from people; a filled value means a bot. */
    website: z.string().max(0),
  })
  .superRefine((value, ctx) => {
    if (value.vehicleChoice === OTHER_OPTION && !value.vehicleOther) {
      ctx.addIssue({
        code: "custom",
        path: ["vehicleOther"],
        message: "Tuliskan jenis mobil yang Anda inginkan",
      });
    }
    if (value.referralSource === OTHER_OPTION && !value.referralSourceOther) {
      ctx.addIssue({
        code: "custom",
        path: ["referralSourceOther"],
        message: "Tuliskan dari mana Anda mengetahui JGS",
      });
    }
    /*
     * For a known platform the pair must resolve to an address the operator can
     * open — that is the whole point of collecting it. "Lainnya" is exempt: a
     * username there has no profile root to hang off, and the console falls
     * back to showing the text.
     */
    if (
      value.socialPlatform &&
      value.socialPlatform !== OTHER_OPTION &&
      !socialProfileUrl(value.socialPlatform, value.socialAccount)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["socialAccount"],
        message: "Tautan tidak valid. Tempel link profil, atau tulis username saja.",
      });
    }
  });

export type RentalFormValues = z.input<typeof rentalFormSchema>;

export const defaultRentalFormValues: RentalFormValues = {
  email: "",
  fullName: "",
  address: "",
  whatsapp: "",
  gsmNumber: "",
  emergencyNumber: "",
  socialPlatform: "",
  socialAccount: "",
  purpose: "",
  usageLocation: "",
  startDate: "",
  startTime: "09:00",
  durationDays: 1,
  vehicleChoice: "",
  vehicleOther: "",
  driver: "tidak",
  referralSource: "",
  referralSourceOther: "",
  agreement: false as unknown as true,
  website: "",
};

/**
 * Which fields each step owns, so "Lanjut" validates only what is on screen.
 * Step 3 (documents) is not in here — uploads are not react-hook-form state.
 */
export const stepFields = {
  penyewa: [
    "email",
    "fullName",
    "address",
    "whatsapp",
    "gsmNumber",
    "emergencyNumber",
    "socialPlatform",
    "socialAccount",
  ],
  sewa: [
    "purpose",
    "usageLocation",
    "startDate",
    "startTime",
    "durationDays",
    "vehicleChoice",
    "vehicleOther",
    "driver",
    "referralSource",
    "referralSourceOther",
  ],
  konfirmasi: ["agreement"],
} as const satisfies Record<string, readonly (keyof RentalFormValues)[]>;
