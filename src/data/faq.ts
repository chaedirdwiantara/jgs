export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
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
