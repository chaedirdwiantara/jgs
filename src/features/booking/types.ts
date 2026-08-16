/** Domain types for the booking flow. UI-agnostic on purpose. */

export type CustomerType = "perorangan" | "perusahaan";

/**
 * Daily and monthly are priced from different columns of the price list, not by
 * multiplying one into the other — a month costs well under 30 daily rates.
 */
export type RentalPackage = "harian" | "bulanan";

/** Everything captured in step 1 of the wizard. */
export type BookingDetails = {
  customerType: CustomerType;
  fullName: string;
  companyName: string;
  whatsapp: string;

  startDate: string; // YYYY-MM-DD

  rentalPackage: RentalPackage;
  /**
   * Days when `rentalPackage` is "harian", months when "bulanan".
   *
   * One field rather than two, because only one is ever meaningful: a second
   * field would sit stale in form state and travel into the submission, which
   * is exactly the trap the removed antar-jemput branch used to spring.
   */
  duration: number;

  notes: string;
};

/** Full booking, i.e. step 1 + the vehicle chosen in step 2. */
export type Booking = BookingDetails & {
  vehicleId: string;
};

export type PriceLine = {
  label: string;
  /** Optional secondary text, e.g. "Rp 750.000 × 3 hari". */
  detail?: string;
  amount: number;
};

export type PriceEstimate = {
  lines: PriceLine[];
  total: number;
};

export type WizardStepId = "detail" | "armada" | "konfirmasi";
