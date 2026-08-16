/**
 * Single source of truth for company identity and contact channels.
 *
 * ⚠️ PLACEHOLDER VALUES
 * The entries marked `TODO` below are placeholders so the app runs end-to-end.
 * Replace them with the real operational data before going live — nothing else
 * in the codebase hard-codes these values.
 */

export const siteConfig = {
  legalName: "PT Jagayanigiri Sentosa",
  brandName: "Jagayanigiri",
  productName: "Jagayanigiri EV Rental",
  tagline: "Sewa mobil listrik, tanpa ribet.",
  description:
    "Layanan sewa mobil 100% listrik dari PT Jagayanigiri Sentosa. Rental harian di wilayah Jabodetabek dengan armada EV terawat, driver profesional, dan harga transparan.",

  /** Domain produksi. Dipakai untuk metadata & sitemap. */
  url: "https://jgs-ev.com",

  contact: {
    /** Nomor WhatsApp admin. Format bebas — dinormalisasi otomatis ke 62…. */
    whatsapp: "0813-8028-7288",
    /** TODO: ganti dengan email resmi. */
    email: "halo@jagayanigiri.co.id",
    /**
     * TODO: ganti bila ada nomor telepon kantor terpisah. Sementara diarahkan
     * ke nomor admin yang sama agar tidak ada nomor palsu tampil di header.
     */
    phone: "0813-8028-7288",
    /** TODO: ganti dengan alamat kantor. */
    address: "Jakarta Selatan, DKI Jakarta, Indonesia",
    operationalHours: "Setiap hari, 06.00 – 22.00 WIB",
  },

  social: {
    /** TODO: isi atau hapus entri yang tidak dipakai. */
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Armada", href: "/armada" },
  { label: "Sewa Mobil", href: "/sewa-mobil" },
  { label: "Tentang", href: "/tentang" },
  { label: "Kontak", href: "/kontak" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Layanan",
    items: [
      { label: "Rental Harian", href: "/sewa-mobil" },
      { label: "Sewa Korporat", href: "/kontak" },
    ],
  },
  {
    title: "Perusahaan",
    items: [
      { label: "Tentang Kami", href: "/tentang" },
      { label: "Armada", href: "/armada" },
      { label: "Kontak", href: "/kontak" },
    ],
  },
];
