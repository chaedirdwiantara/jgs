import { defaultBookingDetails } from "./constants";
import type { BookingDetails } from "./types";

/**
 * Strips values belonging to the service type that was *not* selected.
 *
 * react-hook-form keeps the state of unmounted inputs, so a user who fills the
 * rental branch and then switches to antar-jemput would otherwise carry a stale
 * `startDate` (and vice versa) into the booking payload. Normalising once, at
 * the boundary between the form and the domain, keeps every downstream consumer
 * — pricing, summary, WhatsApp message — free of defensive branching.
 */
export function normalizeBookingDetails(values: BookingDetails): BookingDetails {
  const base: BookingDetails = {
    ...values,
    companyName: values.customerType === "perusahaan" ? values.companyName : "",
  };

  if (values.serviceType === "rental-harian") {
    return {
      ...base,
      pickupDate: defaultBookingDetails.pickupDate,
      pickupTime: defaultBookingDetails.pickupTime,
      destination: defaultBookingDetails.destination,
      tripType: defaultBookingDetails.tripType,
    };
  }

  return {
    ...base,
    startDate: defaultBookingDetails.startDate,
    durationDays: defaultBookingDetails.durationDays,
    deliveryAddress: defaultBookingDetails.deliveryAddress,
  };
}
