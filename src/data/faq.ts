import { siteConfig } from "@/config/site";
import { serviceAreaLabel } from "@/data/service-areas";
import {
  MAX_DURATION_DAYS,
  MIN_DURATION_DAYS,
} from "@/features/booking/constants";

export type FaqItem = {
  question: string;
  answer: string;
};

/**
 * General questions, shown on the home page.
 *
 * Kept separate from `bookingFaqItems` so the two lists never repeat each
 * other — both are also emitted as `FAQPage` structured data, and Google
 * expects each page's questions to be the ones visible on that page.
 */
export const homeFaqItems: FaqItem[] = [
  {
    question: "Apakah harga yang tampil sudah final?",
    answer:
      "Belum, dan seluruh tarif yang tampil belum termasuk PPN. Angka tersebut adalah estimasi awal berdasarkan tarif armada dan durasi yang Anda pilih. Tim kami mengonfirmasi ketersediaan unit dan harga final melalui WhatsApp sebelum pemesanan dianggap sah.",
  },
  {
    question: "Berapa DP dan deposit yang harus dibayar?",
    answer:
      "DP sebesar Rp 300.000 dibayarkan setelah data Anda terverifikasi, untuk mengunci unit dan tanggal. Sisa pembayaran dilunasi pada hari penyewaan. Selain itu ada deposit jaminan Rp 1.000.000 yang dikembalikan penuh apabila unit kembali dalam kondisi baik dan tidak ada e-tilang. Rinciannya ada di halaman Cara Sewa.",
  },
  {
    question: "Di mana unit diserahkan?",
    answer:
      "Unit dapat diambil di pool kami atau diantar ke alamat Anda di wilayah Jabodetabek. Titik serah terima beserta waktunya kami sepakati bersama melalui WhatsApp setelah pesanan masuk, sehingga Anda tidak perlu mengisi alamat pada formulir.",
  },
  {
    question: "Apakah sewa sudah termasuk driver?",
    answer:
      "Anda dapat memilih lepas kunci atau dengan driver. Sampaikan preferensi Anda pada catatan pemesanan dan tim kami akan menyesuaikan penawaran.",
  },
  {
    question: "Bagaimana dengan pengisian daya selama sewa?",
    answer:
      "Setiap unit diserahkan dalam kondisi baterai penuh. Kami membekali peta lokasi SPKLU di sekitar rute Anda, dan tim dukungan siap membantu bila Anda kesulitan menemukan titik pengisian.",
  },
  {
    question: "Dokumen apa yang perlu saya siapkan?",
    answer:
      "Foto Kartu Keluarga, KTP, dan SIM A yang masih berlaku, ditambah nomor kontak darurat yang bisa dihubungi. Untuk penyewa perusahaan, kami juga memerlukan surat pemesanan resmi serta identitas penanggung jawab. Dokumen diverifikasi lebih dulu — DP baru dibayarkan setelah data Anda dinyatakan lengkap.",
  },
  {
    question: "Apakah unit boleh dibawa ke luar Jabodetabek?",
    answer:
      "Boleh, selama disampaikan sejak awal. Tuliskan rencana perjalanan Anda pada catatan pemesanan, lalu tim kami akan menghitung penawaran khusus sekaligus memastikan ketersediaan pengisian daya di sepanjang rute tersebut.",
  },
  {
    /*
     * ⚠️ TODO: konfirmasi kebijakan DP saat pembatalan.
     *
     * Jawaban ini sengaja tidak menyebut DP hangus atau dikembalikan — daftar
     * harga tidak mengaturnya, dan menjanjikan salah satunya di situs publik
     * adalah komitmen yang belum tentu Anda setujui.
     */
    question: "Bagaimana jika saya perlu membatalkan pesanan?",
    answer:
      "Hubungi admin sesegera mungkin melalui WhatsApp yang sama dengan saat Anda memesan. Ketentuan pembatalan, termasuk status DP yang sudah dibayarkan, dikonfirmasi langsung oleh admin sesuai kondisi pemesanan Anda.",
  },
];

/**
 * Questions about the booking flow itself, shown under the wizard on
 * `/sewa-mobil`. Figures are derived from the booking rules and site config
 * so the answers cannot drift from what the form actually offers.
 */
export const bookingFaqItems: FaqItem[] = [
  {
    question: "Apakah saya harus membuat akun untuk memesan?",
    answer:
      "Tidak perlu. Cukup isi detail sewa pada formulir di halaman ini — tanggal mulai, lama sewa, dan data pemesan. Ringkasan pesanan Anda otomatis terkirim ke admin kami melalui WhatsApp untuk diproses lebih lanjut.",
  },
  {
    question: "Bisakah saya memilih unit tertentu, bukan hanya kategori?",
    answer:
      "Bisa. Setelah Anda mengisi tanggal dan lama sewa, sistem menampilkan unit yang tersedia beserta kapasitas dan estimasi tarifnya. Anda dapat memilih langsung dari daftar tersebut, atau menyampaikan preferensi model tertentu ke admin melalui WhatsApp.",
  },
  {
    question: "Berapa lama proses konfirmasi setelah saya kirim pesanan?",
    answer: `Admin biasanya membalas dalam hitungan menit pada jam operasional (${siteConfig.contact.operationalHours}). Anda akan menerima konfirmasi ketersediaan unit, harga final, serta instruksi pembayaran DP langsung melalui WhatsApp yang sama dengan nomor pemesanan.`,
  },
  {
    question: "Apakah tersedia paket sewa bulanan, bukan hanya harian?",
    answer: `Tersedia. Selain rental harian (${MIN_DURATION_DAYS}–${MAX_DURATION_DAYS} hari), kami juga melayani sewa bulanan dengan tarif khusus untuk kebutuhan pribadi maupun operasional perusahaan. Pilih paket Bulanan pada formulir, atau sampaikan kebutuhan Anda langsung ke admin untuk penawaran korporat.`,
  },
  {
    question: "Apakah ada batas jarak tempuh (kilometer) per hari?",
    answer: `Tidak ada batas kilometer untuk pemakaian dalam wilayah ${serviceAreaLabel}. Yang perlu diperhatikan adalah jangkauan baterai tiap unit — tim kami membantu memetakan titik SPKLU di sepanjang rencana perjalanan Anda agar tidak kehabisan daya di tengah jalan.`,
  },
  {
    question: "Bagaimana jika saya ingin memperpanjang masa sewa?",
    answer:
      "Hubungi admin melalui WhatsApp minimal satu hari sebelum masa sewa berakhir. Perpanjangan bergantung pada ketersediaan unit untuk jadwal sesudahnya, dan tarif tambahan dihitung mengikuti sisa hari yang Anda butuhkan.",
  },
  {
    question: "Apa saja metode pembayaran yang diterima?",
    answer:
      "Pembayaran DP dan pelunasan dapat dilakukan melalui transfer bank sesuai instruksi yang diberikan admin setelah pesanan dikonfirmasi. Untuk penyewa korporat, kami juga dapat menerbitkan invoice resmi sesuai kebutuhan administrasi perusahaan Anda.",
  },
  {
    question: "Apa yang terjadi jika unit yang saya pilih ternyata tidak tersedia?",
    answer:
      "Admin akan segera menginformasikan dan menawarkan unit alternatif dengan kategori atau kapasitas setara. Karena harga di formulir masih berupa estimasi awal, DP baru diminta setelah unit dan tanggal benar-benar dikonfirmasi tersedia.",
  },
];
