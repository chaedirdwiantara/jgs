import type { Vehicle } from "@/data/vehicles";

import { DURATION_DISCOUNTS } from "./constants";
import type { BookingDetails, PriceEstimate, PriceLine } from "./types";
import { formatIDR } from "@/lib/format";

/**
 * Indicative price for a booking. Deliberately pure so it can be unit-tested
 * and reused server-side later. The result is always presented as an estimate:
 * the final amount is confirmed by admin over WhatsApp.
 *
 * The two packages are priced from separate columns of the published price
 * list. A month is *not* thirty daily rates — the Denza is Rp 2.000.000/day but
 * Rp 36.000.000/month — so the monthly package multiplies `monthlyRate` and
 * skips the daily discount ladder, which would otherwise discount an already
 * discounted rate.
 *
 * All figures exclude PPN, matching the published list.
 */
export function estimatePrice(
  details: Pick<BookingDetails, "rentalPackage" | "duration">,
  vehicle: Vehicle,
): PriceEstimate {
  const units = Math.max(1, Math.trunc(details.duration) || 1);
  const monthly = details.rentalPackage === "bulanan";

  const rate = monthly ? vehicle.monthlyRate : vehicle.dailyRate;
  const unitLabel = monthly ? "bulan" : "hari";
  const subtotal = rate * units;

  const lines: PriceLine[] = [
    {
      label: `Sewa ${vehicle.name}`,
      detail: `${formatIDR(rate)} × ${units} ${unitLabel}`,
      amount: subtotal,
    },
  ];

  if (!monthly) {
    const discount = DURATION_DISCOUNTS.find((tier) => units >= tier.minDays);
    if (discount) {
      lines.push({
        label: discount.label,
        amount: -Math.round(subtotal * discount.rate),
      });
    }
  }

  const total = lines.reduce((sum, line) => sum + line.amount, 0);

  return { lines, total: Math.max(total, 0) };
}
