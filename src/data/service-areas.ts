/**
 * Wilayah operasional.
 *
 * Kami hanya melayani Jabodetabek — tidak ada layanan bandara dan tidak ada
 * pool di luar wilayah ini. Disimpan sebagai data biasa agar penambahan area
 * cukup dilakukan di berkas ini, tanpa menyentuh satu pun komponen.
 */

/** Kota/kabupaten yang membentuk Jabodetabek, urut sesuai akronimnya. */
export const serviceAreas = [
  "Jakarta",
  "Bogor",
  "Depok",
  "Tangerang",
  "Bekasi",
] as const;

/** Label singkat untuk dipakai di dalam kalimat pemasaran dan metadata. */
export const serviceAreaLabel = "Jabodetabek";
