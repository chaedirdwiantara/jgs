import { z } from "zod";

import { addDaysISO, todayISO, toWhatsAppNumber } from "@/lib/format";

import {
  MAX_DURATION_DAYS,
  MAX_LEAD_DAYS,
  MIN_DURATION_DAYS,
} from "./constants";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Indonesian mobile numbers normalise to `628…` and, including the country
 * code, run 10–15 digits.
 */
const whatsappSchema = z
  .string()
  .trim()
  .min(1, "Nomor WhatsApp wajib diisi")
  .refine((value) => {
    const normalised = toWhatsAppNumber(value);
    return /^628\d{7,12}$/.test(normalised);
  }, "Masukkan nomor WhatsApp Indonesia yang valid, contoh: 08123456789");

function dateWithinBookingWindow(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} wajib diisi`)
    .regex(ISO_DATE, `${label} tidak valid`)
    .refine((value) => value >= todayISO(), `${label} tidak boleh di masa lalu`)
    .refine(
      (value) => value <= addDaysISO(todayISO(), MAX_LEAD_DAYS),
      `${label} maksimal ${MAX_LEAD_DAYS} hari dari sekarang`,
    );
}

/**
 * Step 1 of the wizard. Fields that only apply to one service type are
 * validated conditionally so the other branch can stay empty in form state.
 */
export const bookingDetailsSchema = z
  .object({
    serviceType: z.enum(["rental-harian", "antar-jemput"]),
    customerType: z.enum(["perorangan", "perusahaan"]),

    fullName: z
      .string()
      .trim()
      .min(3, "Nama lengkap minimal 3 karakter")
      .max(80, "Nama lengkap maksimal 80 karakter"),

    /*
     * Branch-specific fields carry NO top-level constraints on purpose.
     *
     * react-hook-form keeps the values of unmounted fields (`shouldUnregister`
     * defaults to `false`), so a constraint declared here would still be
     * evaluated after its input has been hidden by a service-type switch — and
     * the resulting error would have nowhere to render, silently blocking
     * submission. Every branch-specific rule therefore lives in `superRefine`,
     * guarded by the branch that owns the field.
     */
    companyName: z.string().trim(),

    whatsapp: whatsappSchema,

    locationId: z.string().trim().min(1, "Pilih lokasi layanan"),

    /* Rental harian */
    startDate: z.string().trim(),
    durationDays: z
      .number({ error: "Durasi sewa wajib diisi" })
      .int("Durasi sewa harus berupa angka bulat")
      .min(MIN_DURATION_DAYS, `Durasi sewa minimal ${MIN_DURATION_DAYS} hari`)
      .max(MAX_DURATION_DAYS, `Durasi sewa maksimal ${MAX_DURATION_DAYS} hari`),
    deliveryAddress: z.string().trim(),

    /* Antar-jemput */
    pickupDate: z.string().trim(),
    pickupTime: z.string().trim(),
    destination: z.string().trim(),
    tripType: z.enum(["sekali-jalan", "pulang-pergi"]),

    notes: z.string().trim().max(500, "Catatan maksimal 500 karakter"),
  })
  .superRefine((values, ctx) => {
    const fail = (path: keyof typeof values, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });

    if (values.customerType === "perusahaan") {
      if (values.companyName.length < 3) {
        fail("companyName", "Nama perusahaan wajib diisi");
      } else if (values.companyName.length > 120) {
        fail("companyName", "Nama perusahaan maksimal 120 karakter");
      }
    }

    if (values.serviceType === "rental-harian") {
      const result = dateWithinBookingWindow("Tanggal mulai").safeParse(values.startDate);
      if (!result.success) {
        fail("startDate", result.error.issues[0]?.message ?? "Tanggal mulai tidak valid");
      }

      if (values.deliveryAddress.length > 200) {
        fail("deliveryAddress", "Alamat maksimal 200 karakter");
      }
      return;
    }

    const dateResult = dateWithinBookingWindow("Tanggal jemput").safeParse(values.pickupDate);
    if (!dateResult.success) {
      fail("pickupDate", dateResult.error.issues[0]?.message ?? "Tanggal jemput tidak valid");
    }

    if (!HH_MM.test(values.pickupTime)) {
      fail("pickupTime", "Jam jemput wajib diisi");
    }

    if (values.destination.length < 5) {
      fail("destination", "Tujuan / alamat antar wajib diisi (minimal 5 karakter)");
    } else if (values.destination.length > 200) {
      fail("destination", "Alamat tujuan maksimal 200 karakter");
    }
  });

export type BookingDetailsInput = z.input<typeof bookingDetailsSchema>;
export type BookingDetailsValues = z.output<typeof bookingDetailsSchema>;
