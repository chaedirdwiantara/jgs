import { z } from "zod";

import { addDaysISO, todayISO, toWhatsAppNumber } from "@/lib/format";

import {
  MAX_DURATION_DAYS,
  MAX_LEAD_DAYS,
  MIN_DURATION_DAYS,
} from "./constants";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

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

/** Step 1 of the wizard. */
export const bookingDetailsSchema = z
  .object({
    customerType: z.enum(["perorangan", "perusahaan"]),

    fullName: z
      .string()
      .trim()
      .min(3, "Nama lengkap minimal 3 karakter")
      .max(80, "Nama lengkap maksimal 80 karakter"),

    /*
     * `companyName` carries NO constraint here on purpose.
     *
     * It is the one conditionally rendered input in this form, and
     * react-hook-form keeps the values of unmounted fields
     * (`shouldUnregister` defaults to `false`). A constraint declared here
     * would still be evaluated after the input has been hidden by a switch
     * back to "perorangan" — and the resulting error would have nowhere to
     * render, silently blocking submission. Its rules therefore live in
     * `superRefine`, guarded by the customer type that owns the field.
     */
    companyName: z.string().trim(),

    whatsapp: whatsappSchema,

    startDate: dateWithinBookingWindow("Tanggal mulai"),
    durationDays: z
      .number({ error: "Durasi sewa wajib diisi" })
      .int("Durasi sewa harus berupa angka bulat")
      .min(MIN_DURATION_DAYS, `Durasi sewa minimal ${MIN_DURATION_DAYS} hari`)
      .max(MAX_DURATION_DAYS, `Durasi sewa maksimal ${MAX_DURATION_DAYS} hari`),

    notes: z.string().trim().max(500, "Catatan maksimal 500 karakter"),
  })
  .superRefine((values, ctx) => {
    if (values.customerType !== "perusahaan") return;

    const fail = (message: string) =>
      ctx.addIssue({ code: "custom", path: ["companyName"], message });

    if (values.companyName.length < 3) {
      fail("Nama perusahaan wajib diisi");
    } else if (values.companyName.length > 120) {
      fail("Nama perusahaan maksimal 120 karakter");
    }
  });

export type BookingDetailsInput = z.input<typeof bookingDetailsSchema>;
export type BookingDetailsValues = z.output<typeof bookingDetailsSchema>;
