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
  details: Pick<BookingDetails, "durationDays">,
  vehicle: Vehicle,
): PriceEstimate {
  const days = Math.max(1, Math.trunc(details.durationDays) || 1);
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

  const total = lines.reduce((sum, line) => sum + line.amount, 0);

  return { lines, total: Math.max(total, 0) };
}
