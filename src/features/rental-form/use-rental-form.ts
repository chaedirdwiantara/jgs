"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { documentSlots, requiredDocumentSlots } from "@/data/rental-form-options";
import { describeError, RepositoryError } from "@/lib/api-error";
import { useCountdown } from "@/lib/use-countdown";

import {
  submitRentalApplication,
  uploadDocument,
  type SubmitResult,
  type UploadedDocument,
} from "./api";
import {
  defaultRentalFormValues,
  rentalFormSchema,
  stepFields,
  type RentalFormValues,
} from "./schema";

export const wizardSteps = [
  { id: "penyewa", label: "Data Penyewa", hint: "Identitas & kontak" },
  { id: "sewa", label: "Detail Sewa", hint: "Jadwal & unit" },
  { id: "dokumen", label: "Dokumen", hint: "Foto persyaratan" },
  { id: "konfirmasi", label: "Konfirmasi", hint: "Peraturan & kirim" },
] as const;

export type WizardStepId = (typeof wizardSteps)[number]["id"];

export type DocumentState = {
  status: "idle" | "uploading" | "done" | "error";
  /** 0–100 while uploading. */
  progress: number;
  document: UploadedDocument | null;
  error: string | null;
  /** Object URL for the thumbnail; `null` for a PDF. */
  previewUrl: string | null;
};

const idleDocument: DocumentState = {
  status: "idle",
  progress: 0,
  document: null,
  error: null,
  previewUrl: null,
};

function initialDocuments(): Record<string, DocumentState> {
  return Object.fromEntries(documentSlots.map((slot) => [slot.key, { ...idleDocument }]));
}

/**
 * How long "Kirim" stays disabled after a 429 that carried no `Retry-After`
 * (a proxy in the way, or an older API). Long enough to break the tap-tap-tap
 * reflex that turns one refusal into a lockout, short enough not to strand
 * anyone if the header was simply lost.
 */
const FALLBACK_COOLDOWN_SECONDS = 60;

/**
 * Owns the whole intake form: field state, per-slot upload state, step
 * navigation and submission.
 *
 * Photos upload as soon as they are chosen rather than on submit. A renter on a
 * phone picks six files; making them wait for all six to transfer after
 * pressing "Kirim" is how a form gets abandoned — and a failure at that point
 * would lose every one of them at once.
 */
export function useRentalForm() {
  const form = useForm<RentalFormValues>({
    resolver: zodResolver(rentalFormSchema),
    defaultValues: defaultRentalFormValues,
    mode: "onTouched",
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [documents, setDocuments] = useState<Record<string, DocumentState>>(initialDocuments);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);

  /*
   * After the API refuses a submission for being too frequent, the form holds
   * the renter back for exactly as long as the API said, with a visible count.
   * Retrying sooner cannot succeed and only makes the wait look broken.
   */
  const cooldown = useCountdown({
    // The refusal message names a wait that has now passed; leaving it up
    // beside a re-enabled button would contradict itself.
    onFinish: () => form.clearErrors("root"),
  });

  /** Lets a replaced or removed upload cancel the transfer still in flight. */
  const uploads = useRef(new Map<string, AbortController>());

  // Object URLs are a document-lifetime leak unless they are handed back.
  const previews = useRef(new Set<string>());
  useEffect(() => {
    const urls = previews.current;
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
      urls.clear();
    };
  }, []);

  const patchDocument = useCallback((slot: string, patch: Partial<DocumentState>) => {
    setDocuments((current) => ({
      ...current,
      [slot]: { ...(current[slot] ?? idleDocument), ...patch },
    }));
  }, []);

  const selectDocument = useCallback(
    async (slot: string, file: File) => {
      uploads.current.get(slot)?.abort();
      const controller = new AbortController();
      uploads.current.set(slot, controller);

      const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
      if (previewUrl) previews.current.add(previewUrl);

      patchDocument(slot, {
        status: "uploading",
        progress: 0,
        error: null,
        document: null,
        previewUrl,
      });
      setDocumentsError(null);

      try {
        const uploaded = await uploadDocument(slot, file, {
          signal: controller.signal,
          onProgress: (progress) => patchDocument(slot, { progress }),
        });

        patchDocument(slot, { status: "done", progress: 100, document: uploaded });
      } catch (cause) {
        if (controller.signal.aborted) return;
        patchDocument(slot, {
          status: "error",
          progress: 0,
          error: describeError(cause),
          document: null,
        });
      } finally {
        if (uploads.current.get(slot) === controller) uploads.current.delete(slot);
      }
    },
    [patchDocument],
  );

  const removeDocument = useCallback(
    (slot: string) => {
      uploads.current.get(slot)?.abort();
      uploads.current.delete(slot);
      patchDocument(slot, { ...idleDocument });
    },
    [patchDocument],
  );

  /** Every required slot has finished uploading. */
  const documentsComplete = requiredDocumentSlots.every(
    (slot) => documents[slot.key]?.status === "done",
  );

  /** Any slot still transferring — "Kirim" must not race an upload. */
  const isUploading = Object.values(documents).some((state) => state.status === "uploading");

  const goToStep = useCallback((index: number) => {
    setStepIndex(index);
    // A four-step form on a phone scrolls; landing mid-page reads as nothing
    // having happened.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const next = useCallback(async () => {
    const step = wizardSteps[stepIndex];
    if (!step) return;

    if (step.id === "dokumen") {
      if (!documentsComplete) {
        setDocumentsError("Lengkapi semua dokumen bertanda wajib sebelum melanjutkan.");
        return;
      }
      setDocumentsError(null);
      goToStep(stepIndex + 1);
      return;
    }

    const fields = stepFields[step.id as keyof typeof stepFields];
    if (fields && !(await form.trigger([...fields]))) return;

    goToStep(stepIndex + 1);
  }, [stepIndex, documentsComplete, form, goToStep]);

  const back = useCallback(() => {
    if (stepIndex > 0) goToStep(stepIndex - 1);
  }, [stepIndex, goToStep]);

  const submit = form.handleSubmit(async (values) => {
    if (!documentsComplete) {
      setDocumentsError("Lengkapi semua dokumen bertanda wajib.");
      goToStep(2);
      return;
    }

    const uploaded: Record<string, UploadedDocument> = {};
    for (const [slot, state] of Object.entries(documents)) {
      if (state.document) uploaded[slot] = state.document;
    }

    try {
      setResult(await submitRentalApplication(values, uploaded));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (cause) {
      /*
       * Per-field messages from the API are mapped back onto the fields that
       * produced them, and the renter is taken to the step holding the first
       * one — otherwise the error is invisible on the step they are on.
       */
      if (cause instanceof RepositoryError && cause.fieldErrors) {
        let firstStep: number | null = null;

        for (const [field, message] of Object.entries(cause.fieldErrors)) {
          if (field in defaultRentalFormValues) {
            form.setError(field as keyof RentalFormValues, { type: "server", message });
            firstStep ??= stepIndexForField(field);
          } else if (documents[field]) {
            patchDocument(field, { status: "error", error: message, document: null });
            firstStep ??= 2;
          }
        }

        if (firstStep !== null) {
          goToStep(firstStep);
          return;
        }
      }

      if (cause instanceof RepositoryError && cause.kind === "rate-limited") {
        cooldown.start(cause.retryAfterSeconds ?? FALLBACK_COOLDOWN_SECONDS);
      }

      form.setError("root", { type: "server", message: describeError(cause) });
    }
  });

  return {
    form,
    stepIndex,
    step: wizardSteps[stepIndex]!,
    documents,
    documentsError,
    documentsComplete,
    isUploading,
    /** Seconds until "Kirim" is allowed again after a rate-limit refusal; `0` when it is. */
    cooldownSeconds: cooldown.seconds,
    result,
    next,
    back,
    goToStep,
    selectDocument,
    removeDocument,
    submit,
  };
}

/** Which step a server-reported field lives on, so the renter is sent there. */
function stepIndexForField(field: string): number {
  if ((stepFields.penyewa as readonly string[]).includes(field)) return 0;
  if ((stepFields.sewa as readonly string[]).includes(field)) return 1;
  return 3;
}
