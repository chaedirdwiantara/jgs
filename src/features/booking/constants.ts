import type {
  BookingDetails,
  CustomerType,
  RentalPackage,
  WizardStepId,
} from "./types";

export const CUSTOMER_TYPES: { value: CustomerType; label: string }[] = [
  { value: "perorangan", label: "Perorangan" },
  { value: "perusahaan", label: "Perusahaan" },
];

export const MIN_DURATION_DAYS = 1;
export const MAX_DURATION_DAYS = 30;

export const MIN_DURATION_MONTHS = 1;
export const MAX_DURATION_MONTHS = 12;

/** How far ahead a booking may be placed. */
export const MAX_LEAD_DAYS = 180;

export const RENTAL_PACKAGES: {
  value: RentalPackage;
  label: string;
  description: string;
  /** Suffix for the duration field, e.g. "3 hari" / "3 bulan". */
  unit: string;
}[] = [
  {
    value: "harian",
    label: "Harian",
    description: "Sewa per hari, cocok untuk kebutuhan jangka pendek.",
    unit: "hari",
  },
  {
    value: "bulanan",
    label: "Bulanan",
    description: "Tarif lebih hemat untuk pemakaian rutin jangka panjang.",
    unit: "bulan",
  },
];

/** Selectable durations for each package. */
export const DURATION_OPTIONS: Record<RentalPackage, number[]> = {
  harian: Array.from({ length: MAX_DURATION_DAYS }, (_, index) => index + 1),
  bulanan: Array.from({ length: MAX_DURATION_MONTHS }, (_, index) => index + 1),
};

export const durationUnit = (rentalPackage: RentalPackage): string =>
  RENTAL_PACKAGES.find((item) => item.value === rentalPackage)?.unit ?? "hari";

/** e.g. "3 hari", "2 bulan". Used by the recap, summary and WhatsApp message. */
export const formatDuration = (
  rentalPackage: RentalPackage,
  duration: number,
): string => `${duration} ${durationUnit(rentalPackage)}`;

export const WIZARD_STEPS: { id: WizardStepId; label: string; hint: string }[] = [
  { id: "detail", label: "Detail Sewa", hint: "Data pemesan & jadwal" },
  { id: "armada", label: "Pilih Armada", hint: "Unit yang tersedia" },
  { id: "konfirmasi", label: "Konfirmasi", hint: "Ringkasan & kirim" },
];

export const defaultBookingDetails: BookingDetails = {
  customerType: "perorangan",
  fullName: "",
  companyName: "",
  whatsapp: "",
  startDate: "",
  rentalPackage: "harian",
  duration: 1,
  notes: "",
};

/**
 * Long-rental discount ladder, applied to the daily subtotal.
 *
 * ⚠️ PLACEHOLDER — set to `[]` to disable, or replace with the real commercial
 * policy. Evaluated top-down; the first matching tier wins.
 *
 * Only applies to the daily package: the monthly rate is already the discounted
 * price, so stacking this on top would undercut the published price list.
 */
export const DURATION_DISCOUNTS: { minDays: number; rate: number; label: string }[] = [
  { minDays: 14, rate: 0.15, label: "Diskon sewa 14 hari+ (15%)" },
  { minDays: 7, rate: 0.1, label: "Diskon sewa mingguan (10%)" },
];

/** Booking fee taken to hold the unit and date. Balance is paid on handover. */
export const DEPOSIT_DP = 300_000;

/** Refundable security deposit, returned if the unit comes back clean. */
export const SECURITY_DEPOSIT = 1_000_000;

/** Charged per damaged body panel after an incident. */
export const REPAIR_COST_PER_PANEL = 500_000;

/** Bookings must be placed at least this many days ahead (H-1). */
export const MIN_LEAD_DAYS = 1;
