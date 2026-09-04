/**
 * Single source of truth for company identity and contact channels.
 *
 * ⚠️ PLACEHOLDER VALUES
 * The entries marked `TODO` below are placeholders so the app runs end-to-end.
 * Replace them with the real operational data before going live — nothing else
 * in the codebase hard-codes these values.
 */

export const siteConfig = {
  legalName: "PT Jayanagiri Sentosa",
  brandName: "Jayanagiri",
  productName: "Jayanagiri EV Rental",
  tagline: "Sewa mobil listrik, tanpa ribet.",
  description:
    "Layanan sewa mobil 100% listrik dari PT Jayanagiri Sentosa. Rental harian di wilayah Jabodetabek dengan armada EV terawat, driver profesional, dan harga transparan.",

  /** Domain produksi. Dipakai untuk metadata & sitemap. */
  url: "https://jgs-ev.com",

  contact: {
    /** Nomor WhatsApp admin. Format bebas — dinormalisasi otomatis ke 62…. */
    whatsapp: "0811803090",
    /** TODO: ganti dengan email resmi. */
    email: "halo@jagayanigiri.co.id",
    /**
     * TODO: ganti bila ada nomor telepon kantor terpisah. Sementara diarahkan
     * ke nomor admin yang sama agar tidak ada nomor palsu tampil di header.
     */
    phone: "0811803090",
    /** Garasi JGS — titik serah terima unit bila diambil sendiri. */
    address: "Jl. Catur No. 10, Menteng Dalam, Jakarta Selatan",
    /** Patokan yang dipakai di materi promosi. */
    addressLandmark: "Samping Menara Bidakara",
    operationalHours: "Setiap hari, 06.00 – 22.00 WIB",
  },

  social: {
    /** TODO: isi atau hapus entri yang tidak dipakai. */
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
  },

  /**
   * Pengenal publik untuk perkakas Google. Keduanya aman disimpan di repo:
   * hanya berlaku untuk domain ini dan tidak membuka akses apa pun sendiri.
   */
  google: {
    /** Tag `google-site-verification` — bukti kepemilikan di Search Console. */
    siteVerification: "T4DrsVsnWbZnuJM5stNfu-FJ7o3XDo4uOJRNhRgM47g",
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
  { label: "Cara Sewa", href: "/cara-sewa" },
  { label: "Tentang", href: "/tentang" },
  { label: "Kontak", href: "/kontak" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Layanan",
    items: [
      { label: "Rental Harian", href: "/sewa-mobil" },
      { label: "Sewa Bulanan", href: "/sewa-mobil" },
      { label: "Sewa Korporat", href: "/kontak" },
    ],
  },
  {
    title: "Perusahaan",
    items: [
      { label: "Tentang Kami", href: "/tentang" },
      { label: "Armada", href: "/armada" },
      { label: "Cara Sewa", href: "/cara-sewa" },
      { label: "Kontak", href: "/kontak" },
    ],
  },
];
