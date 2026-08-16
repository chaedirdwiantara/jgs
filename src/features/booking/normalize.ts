import type { BookingDetails } from "./types";

/**
 * Strips values belonging to a branch the user did not end up on.
 *
 * react-hook-form keeps the state of unmounted inputs, so someone who fills in
 * a company name and then switches back to "perorangan" would otherwise carry
 * it into the booking payload. Normalising once, at the boundary between the
 * form and the domain, keeps every downstream consumer — pricing, summary,
 * WhatsApp message — free of defensive branching.
 */
export function normalizeBookingDetails(values: BookingDetails): BookingDetails {
  return {
    ...values,
    companyName: values.customerType === "perusahaan" ? values.companyName : "",
  };
}
