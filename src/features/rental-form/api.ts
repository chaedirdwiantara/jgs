import { apiRequest } from "@/lib/api-client";
import { RepositoryError } from "@/lib/api-error";

import { toWhatsAppNumber } from "@/lib/format";

import type { RentalFormValues } from "./schema";

/** Must match `ALLOWED_TYPES` in the API's `create-upload-ticket.ts`. */
export const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
] as const;

/** Must match `MAX_UPLOAD_BYTES` in the API. */
export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

/** What `<input accept>` should offer. */
export const ACCEPT_ATTRIBUTE = "image/jpeg,image/png,image/webp,image/heic,image/heif,.pdf";

type UploadTicket = {
  url: string;
  fields: Record<string, string>;
  key: string;
  maxBytes: number;
  expiresAt: string;
};

export type UploadedDocument = {
  key: string;
  name: string;
  sizeBytes: number;
};

/**
 * iOS hands over HEIC photos with an empty `type` often enough that trusting it
 * alone rejects perfectly good uploads. The extension is the fallback.
 */
function resolveContentType(file: File): string | null {
  if ((ACCEPTED_TYPES as readonly string[]).includes(file.type)) return file.type;

  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  const byExtension: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".heic": "image/heic",
    ".heif": "image/heif",
    ".pdf": "application/pdf",
  };

  return byExtension[extension] ?? null;
}

/**
 * Uploads one photo straight to object storage.
 *
 * The file never touches our API: it asks for a short-lived, single-object
 * ticket and the browser POSTs the bytes to S3 itself. A 6 MB KTP scan
 * therefore costs no Lambda time and no request payload.
 */
export async function uploadDocument(
  slot: string,
  file: File,
  options: { onProgress?: (percent: number) => void; signal?: AbortSignal } = {},
): Promise<UploadedDocument> {
  const contentType = resolveContentType(file);
  if (!contentType) {
    throw new RepositoryError(
      "validation",
      "Format berkas tidak didukung. Gunakan JPG, PNG, WEBP, HEIC, atau PDF.",
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new RepositoryError(
      "validation",
      `Ukuran berkas maksimal ${Math.floor(MAX_UPLOAD_BYTES / 1024 / 1024)} MB.`,
    );
  }

  if (file.size === 0) {
    throw new RepositoryError("validation", "Berkas kosong. Pilih foto lain.");
  }

  const ticket = await apiRequest<UploadTicket>("/uploads", {
    method: "POST",
    body: { slot, contentType },
    signal: options.signal,
  });

  const form = new FormData();
  for (const [name, value] of Object.entries(ticket.fields)) {
    form.append(name, value);
  }
  // S3 ignores everything after `file` in a POST policy upload, so it must be
  // appended last.
  form.append("file", file, file.name);

  await postWithProgress(ticket.url, form, options);

  return { key: ticket.key, name: file.name, sizeBytes: file.size };
}

/**
 * `XMLHttpRequest`, not `fetch`: only XHR reports upload progress, and on a
 * phone connection a 6 MB photo with no progress bar looks like a hung form.
 */
function postWithProgress(
  url: string,
  form: FormData,
  options: { onProgress?: (percent: number) => void; signal?: AbortSignal },
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", url, true);

    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        options.onProgress?.(Math.round((event.loaded / event.total) * 100));
      }
    });

    request.addEventListener("load", () => {
      if (request.status >= 200 && request.status < 300) {
        resolve();
        return;
      }

      // S3 answers with an XML <Message>; surfacing it verbatim would be noise,
      // but the two failures a renter can actually hit are worth naming.
      const expired = request.status === 403;
      reject(
        new RepositoryError(
          expired ? "validation" : "network",
          expired
            ? "Sesi unggah kedaluwarsa. Coba unggah ulang foto ini."
            : "Gagal mengunggah berkas. Periksa koneksi Anda lalu coba lagi.",
        ),
      );
    });

    request.addEventListener("error", () => {
      reject(
        new RepositoryError("network", "Gagal mengunggah berkas. Periksa koneksi Anda."),
      );
    });

    request.addEventListener("abort", () => {
      reject(new DOMException("Aborted", "AbortError"));
    });

    options.signal?.addEventListener("abort", () => request.abort(), { once: true });

    request.send(form);
  });
}

export type SubmitResult = {
  id: string;
  referenceCode: string;
};

/** Sends the completed form. Documents are referenced by the keys already uploaded. */
export async function submitRentalApplication(
  values: RentalFormValues,
  documents: Record<string, UploadedDocument>,
  signal?: AbortSignal,
): Promise<SubmitResult> {
  const documentKeys: Record<string, string> = {};
  const documentNames: Record<string, string> = {};

  for (const [slot, document] of Object.entries(documents)) {
    documentKeys[slot] = document.key;
    documentNames[slot] = document.name;
  }

  return apiRequest<SubmitResult>("/applications", {
    method: "POST",
    body: {
      email: values.email.trim(),
      fullName: values.fullName.trim(),
      address: values.address.trim(),
      whatsapp: toWhatsAppNumber(values.whatsapp),
      gsmNumber: toWhatsAppNumber(values.gsmNumber),
      emergencyNumber: toWhatsAppNumber(values.emergencyNumber),

      purpose: values.purpose.trim(),
      usageLocation: values.usageLocation.trim(),
      startDate: values.startDate,
      startTime: values.startTime,
      durationDays: Number(values.durationDays),

      vehicleChoice: values.vehicleChoice,
      vehicleOther: values.vehicleOther.trim() || null,
      withDriver: values.driver === "ya",
      referralSource: values.referralSource,
      referralSourceOther: values.referralSourceOther.trim() || null,

      documentKeys,
      documentNames,
      website: values.website,
    },
    signal,
  });
}
