const LOCALE = "id-ID";
const TIME_ZONE = "Asia/Jakarta";

const idr = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** `1200000` -> `"Rp 1.200.000"` */
export function formatIDR(value: number): string {
  // Intl renders "Rp 1.200.000" with a non-breaking space; normalise it so the
  // string is predictable in tests and in the WhatsApp message body.
  return idr.format(Math.round(value)).replace(/ /g, " ");
}

/** `"2026-08-12"` -> `"Rabu, 12 Agustus 2026"`. Returns `""` for empty input. */
export function formatDateID(isoDate: string): string {
  if (!isoDate) return "";
  const date = parseISODate(isoDate);
  if (!date) return isoDate;

  return new Intl.DateTimeFormat(LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Short variant: `"12 Agu 2026"`. */
export function formatDateShortID(isoDate: string): string {
  if (!isoDate) return "";
  const date = parseISODate(isoDate);
  if (!date) return isoDate;

  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Today's date in `YYYY-MM-DD`, evaluated in Asia/Jakarta (WIB).
 *
 * Operations run in Jabodetabek, so WIB is the zone every rental date is
 * meant in — regardless of where the customer happens to be booking from.
 */
export function todayISO(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return parts; // en-CA already yields YYYY-MM-DD
}

/** Adds `days` to an ISO date string, returning a new ISO date string. */
export function addDaysISO(isoDate: string, days: number): string {
  const date = parseISODate(isoDate);
  if (!date) return isoDate;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function parseISODate(isoDate: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Normalise an Indonesian phone number to the international format WhatsApp
 * expects: `0811…` / `+62811…` / `62 811…` all become `62811…`.
 */
export function toWhatsAppNumber(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}
