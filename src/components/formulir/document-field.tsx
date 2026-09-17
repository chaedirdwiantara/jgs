"use client";

import { AlertCircle, Camera, Check, FileText, Trash2, Upload } from "lucide-react";
import { useId, useRef } from "react";

import { ACCEPT_ATTRIBUTE } from "@/features/rental-form/api";
import type { DocumentState } from "@/features/rental-form/use-rental-form";
import type { DocumentSlotDefinition } from "@/data/rental-form-options";
import { cn } from "@/lib/utils";

type DocumentFieldProps = {
  slot: DocumentSlotDefinition;
  state: DocumentState;
  onSelect: (file: File) => void;
  onRemove: () => void;
};

export function DocumentField({ slot, state, onSelect, onRemove }: DocumentFieldProps) {
  const inputId = useId();
  const pickRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = (input: HTMLInputElement | null) => {
    const file = input?.files?.[0];
    if (file) onSelect(file);
    // Clearing lets the same file be picked again after a failed upload —
    // without it, `change` never fires the second time.
    if (input) input.value = "";
  };

  const isDone = state.status === "done";
  const isUploading = state.status === "uploading";
  const isError = state.status === "error";

  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border bg-white p-4 transition-colors",
        isDone && "border-emerald-300 bg-emerald-50/40",
        isError && "border-danger-300",
        !isDone && !isError && "border-ink-200",
      )}
    >
      <div className="flex items-start gap-3">
        <Thumbnail state={state} />

        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm font-semibold text-ink-900">
            <span id={`${inputId}-label`}>{slot.label}</span>
            {slot.required ? (
              <span className="text-xs font-medium text-danger-600">Wajib</span>
            ) : (
              <span className="text-xs font-normal text-ink-500">(opsional)</span>
            )}
          </p>

          {isDone && state.document ? (
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-emerald-700">
              <Check className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{state.document.name}</span>
              <span className="shrink-0 text-emerald-600">
                · {formatBytes(state.document.sizeBytes)}
              </span>
            </p>
          ) : isError ? (
            <p role="alert" className="mt-0.5 flex items-start gap-1.5 text-xs text-danger-600">
              <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
              {state.error}
            </p>
          ) : (
            <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{slot.hint}</p>
          )}

          {isUploading ? (
            <div className="mt-2.5">
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={state.progress}
                aria-label={`Mengunggah ${slot.label}`}
                className="h-1.5 w-full overflow-hidden rounded-full bg-ink-200"
              >
                <div
                  className="h-full rounded-full bg-brand-600 transition-[width] duration-200 ease-[var(--ease-out-soft)]"
                  style={{ width: `${state.progress}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-ink-500">Mengunggah… {state.progress}%</p>
            </div>
          ) : (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {/*
                The camera shortcut is hidden where there is no camera to open:
                `capture` is ignored on a desktop browser, so the button would
                be a second, identical "choose a file".
              */}
              <ActionButton
                className="hidden pointer-coarse:inline-flex"
                onClick={() => cameraRef.current?.click()}
                icon={<Camera className="size-4" aria-hidden="true" />}
                label={isDone || isError ? "Foto ulang" : "Ambil foto"}
              />
              <ActionButton
                onClick={() => pickRef.current?.click()}
                icon={<Upload className="size-4" aria-hidden="true" />}
                label={isDone || isError ? "Ganti berkas" : "Pilih berkas"}
              />
              {isDone ? (
                <ActionButton
                  onClick={onRemove}
                  tone="danger"
                  icon={<Trash2 className="size-4" aria-hidden="true" />}
                  label="Hapus"
                />
              ) : null}
            </div>
          )}
        </div>
      </div>

      <input
        ref={pickRef}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        aria-labelledby={`${inputId}-label`}
        className="sr-only"
        onChange={(event) => handleFile(event.currentTarget)}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture={slot.capture}
        aria-labelledby={`${inputId}-label`}
        className="sr-only"
        onChange={(event) => handleFile(event.currentTarget)}
      />
    </div>
  );
}

function Thumbnail({ state }: { state: DocumentState }) {
  const shared =
    "flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl sm:size-16";

  if (state.previewUrl) {
    return (
      // A blob: URL from the file the visitor just chose — `next/image` cannot
      // optimise it, and under `output: "export"` there is no optimiser anyway.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={state.previewUrl}
        alt=""
        className={cn(shared, "bg-ink-100 object-cover", state.status === "uploading" && "opacity-60")}
      />
    );
  }

  return (
    <span className={cn(shared, "bg-ink-100 text-ink-400")}>
      <FileText className="size-6" aria-hidden="true" />
    </span>
  );
}

function ActionButton({
  onClick,
  icon,
  label,
  tone = "neutral",
  className,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  tone?: "neutral" | "danger";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset transition-colors",
        tone === "danger"
          ? "text-danger-700 ring-danger-200 hover:bg-danger-50"
          : "text-ink-700 ring-ink-200 hover:bg-ink-50 hover:ring-ink-300",
        className,
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
