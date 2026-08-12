import type { Vehicle } from "@/data/vehicles";

import { DURATION_DISCOUNTS } from "./constants";
import type { BookingDetails, PriceEstimate, PriceLine } from "./types";
import { formatIDR } from "@/lib/format";

/**
 * Indicative price for a booking. Deliberately pure so it can be unit-tested
 * and reused server-side later. The result is always presented as an estimate:
 * the final amount is confirmed by admin over WhatsApp.
 */
export function estimatePrice(
  details: Pick<BookingDetails, "serviceType" | "durationDays" | "tripType">,
  vehicle: Vehicle,
): PriceEstimate {
  const lines: PriceLine[] =
    details.serviceType === "rental-harian"
      ? buildRentalLines(details.durationDays, vehicle)
      : buildTransferLines(details.tripType, vehicle);

  const total = lines.reduce((sum, line) => sum + line.amount, 0);

  return { lines, total: Math.max(total, 0) };
}

function buildRentalLines(durationDays: number, vehicle: Vehicle): PriceLine[] {
  const days = Math.max(1, Math.trunc(durationDays) || 1);
  const subtotal = vehicle.dailyRate * days;

  const lines: PriceLine[] = [
    {
      label: `Sewa ${vehicle.name}`,
      detail: `${formatIDR(vehicle.dailyRate)} × ${days} hari`,
      amount: subtotal,
    },
  ];

  const discount = DURATION_DISCOUNTS.find((tier) => days >= tier.minDays);
  if (discount) {
    lines.push({
      label: discount.label,
      amount: -Math.round(subtotal * discount.rate),
    });
  }

  return lines;
}

function buildTransferLines(
  tripType: BookingDetails["tripType"],
  vehicle: Vehicle,
): PriceLine[] {
  const trips = tripType === "pulang-pergi" ? 2 : 1;

  return [
    {
      label: `Antar-jemput ${vehicle.name}`,
      detail:
        trips === 2
          ? `${formatIDR(vehicle.transferRate)} × 2 perjalanan`
          : "Sekali jalan",
      amount: vehicle.transferRate * trips,
    },
  ];
}

/** Headline price used on vehicle cards, matching the selected service. */
export function displayRate(
  vehicle: Vehicle,
  serviceType: BookingDetails["serviceType"],
): { amount: number; unit: string } {
  return serviceType === "rental-harian"
    ? { amount: vehicle.dailyRate, unit: "hari" }
    : { amount: vehicle.transferRate, unit: "perjalanan" };
}
