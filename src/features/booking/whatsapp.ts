import { siteConfig } from "@/config/site";
import type { Location } from "@/data/locations";
import { tierLabels, type Vehicle } from "@/data/vehicles";
import {
  formatDateID,
  formatIDR,
  formatTimeID,
  toWhatsAppNumber,
} from "@/lib/format";

import { estimatePrice } from "./pricing";
import type { Booking } from "./types";

type MessageContext = {
  booking: Booking;
  vehicle: Vehicle;
  location: Location;
  /** Human-readable reference so admin and customer speak the same language. */
  reference: string;
};

/**
 * Builds the plain-text order summary sent to the admin. Kept separate from
 * the URL builder so it can also be rendered on screen or logged.
 */
export function buildWhatsAppMessage({
  booking,
  vehicle,
  location,
  reference,
}: MessageContext): string {
  const estimate = estimatePrice(booking, vehicle);
  const isRental = booking.serviceType === "rental-harian";

  const lines: string[] = [
    `Halo ${siteConfig.brandName}, saya ingin memesan mobil listrik.`,
    "",
    `*No. Referensi:* ${reference}`,
    `*Layanan:* ${isRental ? "Rental Harian" : "Antar-Jemput"}`,
    "",
    "*Data Pemesan*",
    `• Tipe: ${booking.customerType === "perusahaan" ? "Perusahaan" : "Perorangan"}`,
    `• Nama: ${booking.fullName}`,
  ];

  if (booking.customerType === "perusahaan" && booking.companyName) {
    lines.push(`• Perusahaan: ${booking.companyName}`);
  }

  lines.push(`• WhatsApp: ${booking.whatsapp}`, "", "*Jadwal*", `• Lokasi: ${location.name} (${location.area})`);

  if (isRental) {
    lines.push(
      `• Tanggal mulai: ${formatDateID(booking.startDate)}`,
      `• Durasi: ${booking.durationDays} hari`,
    );
    if (booking.deliveryAddress) {
      lines.push(`• Alamat pengantaran: ${booking.deliveryAddress}`);
    }
  } else {
    lines.push(
      `• Tanggal jemput: ${formatDateID(booking.pickupDate)}`,
      `• Jam jemput: ${formatTimeID(booking.pickupTime, location.timeZoneLabel)}`,
      `• Tujuan: ${booking.destination}`,
      `• Perjalanan: ${booking.tripType === "pulang-pergi" ? "Pulang-Pergi" : "Sekali Jalan"}`,
    );
  }

  lines.push(
    "",
    "*Armada*",
    `• Unit: ${vehicle.name} (${tierLabels[vehicle.tier]})`,
    `• Kapasitas: ${vehicle.seats} kursi, ${vehicle.luggage} bagasi`,
    "",
    "*Estimasi Biaya*",
  );

  for (const line of estimate.lines) {
    lines.push(`• ${line.label}: ${formatIDR(line.amount)}`);
  }

  lines.push(`• *Total estimasi: ${formatIDR(estimate.total)}*`);

  if (booking.notes) {
    lines.push("", "*Catatan*", booking.notes);
  }

  lines.push("", "Mohon dikonfirmasi ketersediaan unit dan harga finalnya. Terima kasih.");

  return lines.join("\n");
}

/** `https://wa.me/<number>?text=<encoded message>` */
export function buildWhatsAppUrl(message: string): string {
  const number = toWhatsAppNumber(siteConfig.contact.whatsapp);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Short, readable reference such as `JGS-8F2K4Q`. */
export function createBookingReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no look-alike glyphs
  let suffix = "";
  for (let index = 0; index < 6; index += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `JGS-${suffix}`;
}
