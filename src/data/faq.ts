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
      "KTP dan SIM A yang masih berlaku untuk penyewa perorangan. Untuk penyewa perusahaan, kami memerlukan surat pemesanan resmi serta identitas penanggung jawab. Dokumen diverifikasi saat serah terima unit.",
  },
  {
    question: "Apakah unit boleh dibawa ke luar Jabodetabek?",
    answer:
      "Boleh, selama disampaikan sejak awal. Tuliskan rencana perjalanan Anda pada catatan pemesanan, lalu tim kami akan menghitung penawaran khusus sekaligus memastikan ketersediaan pengisian daya di sepanjang rute tersebut.",
  },
  {
    question: "Bagaimana jika saya perlu membatalkan pesanan?",
    answer:
      "Pembatalan tanpa biaya dapat dilakukan selama unit belum diberangkatkan menuju titik serah terima. Hubungi admin melalui WhatsApp yang sama dengan saat Anda memesan.",
  },
];
