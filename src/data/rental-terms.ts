/**
 * Rental procedure and incident policy, as published in the JGS price sheet.
 *
 * Kept as data rather than markup so the same figures drive the /cara-sewa
 * page, the booking flow's info boxes and the FAQ — a number that appears in
 * three places is a number that will eventually disagree with itself.
 *
 * Money values live in `features/booking/constants.ts` alongside the other
 * commercial constants; this file describes the process around them.
 */

export type RentalStep = {
  title: string;
  description: string;
};

/** The five steps from booking to handover. */
export const rentalSteps: RentalStep[] = [
  {
    title: "Tentukan tanggal sewa",
    description:
      "Pilih unit dan tanggal mulai. Pemesanan dilakukan paling lambat H-1 sebelum tanggal pemakaian.",
  },
  {
    title: "Isi formulir data pribadi",
    description:
      "Lampirkan foto KK, KTP, dan SIM yang masih berlaku, beserta nomor kontak darurat yang bisa dihubungi.",
  },
  {
    title: "Bayar DP untuk mengunci unit",
    description:
      "Setelah data terverifikasi, DP dibayarkan untuk mengunci unit dan tanggal yang Anda pilih.",
  },
  {
    title: "Pelunasan di hari penyewaan",
    description:
      "Sisa pembayaran diselesaikan pada hari penyewaan, saat unit diserahterimakan.",
  },
  {
    title: "Bayar deposit jaminan",
    description:
      "Deposit dikembalikan penuh apabila unit kembali dalam kondisi baik dan tidak ada e-tilang yang tercatat.",
  },
];

export type IncidentRule = {
  title: string;
  description: string;
};

/** What happens if the unit is damaged while it is with the renter. */
export const incidentRules: IncidentRule[] = [
  {
    title: "Deposit ditahan",
    description:
      "Deposit jaminan ditahan sampai proses perbaikan selesai dan total biaya diketahui.",
  },
  {
    title: "Perbaikan di bengkel rekanan",
    description:
      "Perbaikan hanya dikerjakan di bengkel rekanan JGS agar mutu dan biayanya terkontrol.",
  },
  {
    title: "Biaya perbaikan per panel",
    description:
      "Dihitung dari jumlah panel bodi yang terdampak, bukan dari nilai kerusakan keseluruhan.",
  },
];
