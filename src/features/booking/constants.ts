import type {
  BookingDetails,
  CustomerType,
  ServiceType,
  TripType,
  WizardStepId,
} from "./types";

export const SERVICE_TYPES: {
  value: ServiceType;
  label: string;
  description: string;
}[] = [
  {
    value: "rental-harian",
    label: "Rental Harian",
    description: "Sewa unit per hari, lepas kunci atau dengan driver.",
  },
  {
    value: "antar-jemput",
    label: "Antar-Jemput",
    description: "Penjemputan bandara atau titik lain, sekali jalan / PP.",
  },
];

export const CUSTOMER_TYPES: { value: CustomerType; label: string }[] = [
  { value: "perorangan", label: "Perorangan" },
  { value: "perusahaan", label: "Perusahaan" },
];

export const TRIP_TYPES: { value: TripType; label: string; description: string }[] = [
  {
    value: "sekali-jalan",
    label: "Sekali Jalan",
    description: "Satu kali perjalanan menuju tujuan.",
  },
  {
    value: "pulang-pergi",
    label: "Pulang-Pergi",
    description: "Termasuk perjalanan kembali.",
  },
];

export const MIN_DURATION_DAYS = 1;
export const MAX_DURATION_DAYS = 30;

/** How far ahead a booking may be placed. */
export const MAX_LEAD_DAYS = 180;

export const DURATION_OPTIONS = Array.from(
  { length: MAX_DURATION_DAYS },
  (_, index) => index + 1,
);

export const WIZARD_STEPS: { id: WizardStepId; label: string; hint: string }[] = [
  { id: "detail", label: "Detail Sewa", hint: "Data pemesan & jadwal" },
  { id: "armada", label: "Pilih Armada", hint: "Unit yang tersedia" },
  { id: "konfirmasi", label: "Konfirmasi", hint: "Ringkasan & kirim" },
];

export const defaultBookingDetails: BookingDetails = {
  serviceType: "rental-harian",
  customerType: "perorangan",
  fullName: "",
  companyName: "",
  whatsapp: "",
  locationId: "",
  startDate: "",
  durationDays: 1,
  deliveryAddress: "",
  pickupDate: "",
  pickupTime: "",
  destination: "",
  tripType: "sekali-jalan",
  notes: "",
};

/**
 * Long-rental discount ladder, applied to the daily subtotal.
 *
 * ⚠️ PLACEHOLDER — set to `[]` to disable, or replace with the real commercial
 * policy. Evaluated top-down; the first matching tier wins.
 */
export const DURATION_DISCOUNTS: { minDays: number; rate: number; label: string }[] = [
  { minDays: 14, rate: 0.15, label: "Diskon sewa 14 hari+ (15%)" },
  { minDays: 7, rate: 0.1, label: "Diskon sewa mingguan (10%)" },
];
