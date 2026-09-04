import { siteConfig } from "@/config/site";
import { toWhatsAppNumber } from "@/lib/format";

/** Opening line pre-filled when a visitor taps a generic "chat with us" link. */
export const WHATSAPP_GREETING = `Halo ${siteConfig.brandName}, saya ingin bertanya tentang sewa mobil listrik.`;

/**
 * WhatsApp click-to-chat URL: `https://wa.me/62…?text=…`.
 *
 * Preferred over `tel:` wherever the admin number is shown. One tap opens a
 * chat with the message pre-filled — on phones, desktop apps and WhatsApp Web
 * alike — whereas a `tel:` link is a dead end on most desktops and still makes
 * phone users copy the number into WhatsApp by hand.
 */
export function buildWhatsAppUrl(message: string = WHATSAPP_GREETING): string {
  const number = toWhatsAppNumber(siteConfig.contact.whatsapp);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** `tel:` link for the office line, with display formatting stripped. */
export const phoneHref = `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;
