export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "Apakah harga yang tampil sudah final?",
    answer:
      "Belum. Harga yang tampil adalah estimasi awal berdasarkan tarif dasar armada dan durasi yang Anda pilih. Tim kami mengonfirmasi ketersediaan unit dan harga final melalui WhatsApp sebelum pemesanan dianggap sah.",
  },
  {
    question: "Apakah sewa sudah termasuk driver?",
    answer:
      "Untuk layanan antar-jemput bandara, driver sudah termasuk. Untuk rental harian, Anda dapat memilih lepas kunci atau dengan driver — sampaikan preferensi Anda pada catatan pemesanan dan tim kami akan menyesuaikan penawaran.",
  },
  {
    question: "Bagaimana dengan pengisian daya selama sewa?",
    answer:
      "Setiap unit diserahkan dalam kondisi baterai penuh. Kami membekali peta lokasi SPKLU di sekitar rute Anda, dan tim dukungan siap membantu bila Anda kesulitan menemukan titik pengisian.",
  },
  {
    question: "Dokumen apa yang perlu saya siapkan?",
    answer:
      "KTP dan SIM A yang masih berlaku untuk penyewa perorangan. Untuk penyewa perusahaan, kami memerlukan surat pemesanan resmi serta identitas penanggung jawab. Dokumen diverifikasi saat serah terima unit.",
  },
  {
    question: "Apakah bisa antar-jemput ke luar kota?",
    answer:
      "Bisa. Sampaikan tujuan Anda pada kolom alamat saat memesan, lalu tim kami akan menghitung penawaran khusus termasuk biaya perjalanan dan waktu tempuh.",
  },
  {
    question: "Bagaimana jika saya perlu membatalkan pesanan?",
    answer:
      "Pembatalan tanpa biaya dapat dilakukan selama unit belum diberangkatkan menuju titik jemput. Hubungi admin melalui WhatsApp yang sama dengan saat Anda memesan.",
  },
];
