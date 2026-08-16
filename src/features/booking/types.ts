/** Domain types for the booking flow. UI-agnostic on purpose. */

export type CustomerType = "perorangan" | "perusahaan";

/** Everything captured in step 1 of the wizard. */
export type BookingDetails = {
  customerType: CustomerType;
  fullName: string;
  companyName: string;
  whatsapp: string;

  startDate: string; // YYYY-MM-DD
  durationDays: number;

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
