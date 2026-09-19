/**
 * Choices and copy for the renter intake form at `/formulir`.
 *
 * ⚠️ These are the operator's own lists, transcribed from the intake form they
 * already run. Do not "tidy" them against `vehicles.ts` — the unit list here is
 * deliberately wider than the catalogue the marketing site shows, because JGS
 * rents units it has not photographed for the site yet.
 *
 * The sentinel for every free-text option is `OTHER_OPTION`, which the API
 * checks by the same name.
 */

/** Matches `OTHER_OPTION` in the API's `http/schemas.ts`. */
export const OTHER_OPTION = "lainnya";

export type ChoiceOption = {
  value: string;
  label: string;
};

/**
 * "Jenis Mobil". `value` is a stable slug so a rename of the display label
 * never rewrites what is already stored against past submissions.
 */
export const vehicleChoices: ChoiceOption[] = [
  { value: "wuling-air-ev", label: "Wuling Air EV" },
  { value: "wuling-binguo", label: "Wuling Binguo" },
  { value: "neta-v", label: "Neta V" },
  { value: "ioniq-5", label: "IONIQ 5" },
  { value: "byd-seal", label: "BYD Seal" },
  { value: "byd-m6", label: "BYD M6" },
  { value: "cloud", label: "Cloud" },
  { value: "denza", label: "Denza" },
  { value: "atto-1", label: "Atto 1" },
  { value: OTHER_OPTION, label: "Lainnya" },
];

/** "Darimana Anda Mengetahui JGS?" */
export const referralChoices: ChoiceOption[] = [
  { value: "ads", label: "Iklan (ADS)" },
  { value: "ig", label: "Instagram" },
  { value: "fb", label: "Facebook" },
  { value: "referral", label: "Referral / teman" },
  { value: OTHER_OPTION, label: "Lainnya" },
];

export const driverChoices: ChoiceOption[] = [
  { value: "tidak", label: "Tanpa driver (lepas kunci)" },
  { value: "ya", label: "Dengan driver" },
];

/**
 * "Akun media sosial". The operator verifies a renter by opening their profile,
 * so what is stored has to be something clickable — see `socialProfileUrl`.
 */
export const socialPlatformChoices: ChoiceOption[] = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: OTHER_OPTION, label: "Lainnya" },
];

/** Profile roots, so a bare username still resolves to a real page. */
const socialProfileRoots: Record<string, string> = {
  instagram: "https://www.instagram.com/",
  tiktok: "https://www.tiktok.com/@",
  facebook: "https://www.facebook.com/",
};

/** A pasted address that omits the scheme, e.g. `instagram.com/budi`. */
const BARE_DOMAIN = /^[a-z0-9-]+(\.[a-z0-9-]+)+\//i;

/**
 * The link the console opens for an applicant's social account.
 *
 * Accepts both shapes the form allows: a full profile URL pasted from the app,
 * or just the username — which only resolves once the platform is known, which
 * is why the two are stored as a pair.
 *
 * Returns `null` when no address can be built (a username under "Lainnya"), and
 * the caller shows the raw text instead of a dead link.
 *
 * Both arguments are nullable on purpose: applications submitted before this
 * pair existed carry neither, and the console renders them alongside new ones.
 */
export function socialProfileUrl(
  platform: string | null | undefined,
  account: string | null | undefined,
): string | null {
  const value = account?.trim();
  if (!value) return null;

  const candidate = BARE_DOMAIN.test(value) ? `https://${value}` : value;

  if (/^https?:\/\//i.test(candidate)) {
    try {
      const url = new URL(candidate);
      // Anything else — `javascript:`, `data:` — must never reach an `href`.
      return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
    } catch {
      return null;
    }
  }

  const root = platform ? socialProfileRoots[platform] : undefined;
  if (!root) return null;

  return `${root}${value.replace(/^@+/, "")}`;
}

/** Resolves a stored value back to something readable, including free text. */
export function labelForChoice(
  options: ChoiceOption[],
  value: string,
  other?: string | null,
): string {
  if (value === OTHER_OPTION) return other?.trim() || "Lainnya";
  return options.find((option) => option.value === value)?.label ?? value;
}

/**
 * How a social account reads on screen: `Instagram — budi.santoso`.
 *
 * Empty string when nothing was given, which every caller renders as an em
 * dash — including applications from before the field existed.
 */
export function describeSocialAccount(
  platform: string | null | undefined,
  account: string | null | undefined,
): string {
  const value = account?.trim();
  if (!value) return "";

  const label = platform ? labelForChoice(socialPlatformChoices, platform) : "";
  return label ? `${label} — ${value}` : value;
}

/**
 * How a submitted unit is named in the console.
 *
 * Prefers `vehicleLabel` — the name stored at submission time — over looking
 * the slug up in the list above, so a past application keeps reading correctly
 * even after the option list is renamed or the unit is retired.
 */
export function displayVehicle(application: {
  vehicleChoice: string;
  vehicleLabel?: string;
  vehicleOther: string | null;
}): string {
  if (application.vehicleChoice === OTHER_OPTION) {
    return application.vehicleOther?.trim() || "Lainnya";
  }
  return application.vehicleLabel || labelForChoice(vehicleChoices, application.vehicleChoice);
}

/**
 * "Peraturan Sewa Mobil Lepas Kunci", shown in full before the renter can
 * agree to it. Transcribed from the operator's form; the only change is the
 * unbalanced bracket in point 2, which was closed so the sentence parses.
 */
export const lepasKunciRules: string[] = [
  "Wajib melakukan pembayaran di awal.",
  "Wajib deposit Rp1.000.000 untuk unit Premium (BYD Seal / IONIQ 5) dan Rp500.000 untuk unit Ekonomi (Neta V, Wuling Binguo, Wuling Air EV), atau menahan KTP sebagai jaminan.",
  "Penyewa pertama wajib diantar ke rumah, dengan biaya jasa Rp150.000.",
  "Serah terima mobil tidak bisa diwakilkan — harus pemilik data.",
  "Dilarang merokok di dalam mobil.",
  "Setiap kerusakan menjadi tanggungan penyewa.",
];

/**
 * Upload slots, in the order the operator asks for them. Mirrors
 * `DOCUMENT_SLOTS` in the API — both lists must change together.
 *
 * `capture` is the hint a phone gets: `user` opens the front camera for the
 * selfie, `environment` the rear one for documents held up to it.
 */
export type DocumentSlotDefinition = {
  key: string;
  label: string;
  hint: string;
  required: boolean;
  capture: "user" | "environment";
};

export const documentSlots: DocumentSlotDefinition[] = [
  {
    key: "ktp",
    label: "Foto KTP",
    hint: "Pastikan NIK dan nama terbaca jelas.",
    required: true,
    capture: "environment",
  },
  {
    key: "selfieKtp",
    label: "Foto selfie dengan KTP",
    hint: "Wajah dan KTP terlihat dalam satu foto.",
    required: true,
    capture: "user",
  },
  {
    key: "sim",
    label: "Foto SIM",
    hint: "SIM A yang masih berlaku.",
    required: true,
    capture: "environment",
  },
  {
    key: "kartuKeluarga",
    label: "Foto Kartu Keluarga",
    hint: "Halaman yang memuat nama Anda.",
    required: true,
    capture: "environment",
  },
  {
    key: "tokenListrik",
    label: "Foto nomor token listrik rumah",
    hint: "Membantu verifikasi alamat tinggal.",
    required: false,
    capture: "environment",
  },
  {
    key: "riwayatAkun",
    label: "Riwayat & profil akun Grab/GoCar/Maxim/Shopee/Tokopedia",
    hint: "Tangkapan layar riwayat pesanan dan profil.",
    required: false,
    capture: "environment",
  },
];

export const requiredDocumentSlots = documentSlots.filter((slot) => slot.required);

/**
 * Slots the form no longer asks for, so the console can still name the files on
 * applications submitted before the change. Never rendered on the form itself.
 *
 * `sosialMedia` was a screenshot of the renter's profile; it is now the
 * `socialPlatform` + `socialAccount` pair on step 1, which the console can open.
 */
export const legacyDocumentLabels: Record<string, string> = {
  sosialMedia: "Akun media sosial (unggahan lama)",
};
