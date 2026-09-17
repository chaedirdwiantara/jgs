"use client";

import { AlertCircle, ShieldCheck } from "lucide-react";

import { DocumentField } from "@/components/formulir/document-field";
import { documentSlots } from "@/data/rental-form-options";
import type { DocumentState } from "@/features/rental-form/use-rental-form";

type StepDokumenProps = {
  documents: Record<string, DocumentState>;
  error: string | null;
  onSelect: (slot: string, file: File) => void;
  onRemove: (slot: string) => void;
};

/**
 * Step 3 — the identity documents.
 *
 * Each photo uploads the moment it is chosen, so by the time the renter reaches
 * the last step there is nothing left to transfer.
 */
export function StepDokumen({ documents, error, onSelect, onRemove }: StepDokumenProps) {
  const done = documentSlots.filter((slot) => documents[slot.key]?.status === "done").length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-ink-200 bg-ink-50 p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-ink-500" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-ink-600">
          Dokumen ini hanya dipakai untuk verifikasi penyewaan dan disimpan di
          penyimpanan terenkripsi milik JGS. Berkas tidak dibagikan ke pihak lain.
          Format JPG, PNG, WEBP, HEIC, atau PDF, maksimal 12&nbsp;MB per berkas.
        </p>
      </div>

      <p className="text-sm text-ink-600">
        <span className="font-semibold text-ink-900">{done}</span> dari{" "}
        {documentSlots.length} dokumen terunggah.
      </p>

      {error ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-[var(--radius-field)] bg-danger-50 p-3 text-sm text-danger-700"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        {documentSlots.map((slot) => (
          <DocumentField
            key={slot.key}
            slot={slot}
            state={documents[slot.key] ?? {
              status: "idle",
              progress: 0,
              document: null,
              error: null,
              previewUrl: null,
            }}
            onSelect={(file) => onSelect(slot.key, file)}
            onRemove={() => onRemove(slot.key)}
          />
        ))}
      </div>
    </div>
  );
}
