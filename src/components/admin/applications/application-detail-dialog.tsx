"use client";

import {
  AlertCircle,
  ExternalLink,
  FileText,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { StatusBadge } from "@/components/admin/applications/status-badge";
import { Button } from "@/components/ui/button";
import { Select, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  displayVehicle,
  documentSlots,
  labelForChoice,
  referralChoices,
} from "@/data/rental-form-options";
import { applicationRepository, describeError } from "@/features/admin/repository";
import {
  applicationStatuses,
  statusLabels,
  type ApplicationDetail,
  type ApplicationStatus,
  type UpdateApplicationInput,
} from "@/features/admin/types";
import { formatDateID } from "@/lib/format";

type Props = {
  applicationId: string | null;
  canDelete: boolean;
  onClose: () => void;
  onSave: (id: string, patch: UpdateApplicationInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

const documentLabels = new Map(documentSlots.map((slot) => [slot.key, slot.label]));

export function ApplicationDetailDialog({
  applicationId,
  canDelete,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [detail, setDetail] = useState<ApplicationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  /*
   * Seeded from the prop rather than flipped on inside the effect: the parent
   * remounts this component per application (`key`), so the first render
   * already knows whether a fetch is about to start. That keeps every state
   * write inside a promise callback.
   */
  const [isLoading, setIsLoading] = useState(applicationId !== null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [status, setStatus] = useState<ApplicationStatus>("baru");
  const [note, setNote] = useState("");

  const applyDetail = useCallback((data: ApplicationDetail) => {
    setDetail(data);
    setStatus(data.status);
    setNote(data.internalNote ?? "");
    setError(null);
    setIsLoading(false);
  }, []);

  const applyFailure = useCallback((cause: unknown) => {
    setError(describeError(cause));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!applicationId) return;

    const controller = new AbortController();

    applicationRepository
      .get(applicationId, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) applyDetail(data);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) applyFailure(cause);
      });

    return () => controller.abort();
  }, [applicationId, applyDetail, applyFailure]);

  const save = useCallback(async () => {
    if (!applicationId || !detail) return;

    const patch: UpdateApplicationInput = {};
    if (status !== detail.status) patch.status = status;
    if (note !== (detail.internalNote ?? "")) patch.internalNote = note;

    if (Object.keys(patch).length === 0) {
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      await onSave(applicationId, patch);
      onClose();
    } catch (cause) {
      setError(describeError(cause));
    } finally {
      setIsSaving(false);
    }
  }, [applicationId, detail, status, note, onSave, onClose]);

  const remove = useCallback(async () => {
    if (!applicationId) return;

    setIsSaving(true);
    try {
      await onDelete(applicationId);
      onClose();
    } catch (cause) {
      setError(describeError(cause));
    } finally {
      setIsSaving(false);
    }
  }, [applicationId, onDelete, onClose]);

  const hasChanges =
    detail !== null && (status !== detail.status || note !== (detail.internalNote ?? ""));

  return (
    <Modal
      open={applicationId !== null}
      onClose={onClose}
      size="lg"
      title={detail ? detail.fullName : "Detail pengajuan"}
      description={detail ? detail.referenceCode : undefined}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          {canDelete && detail ? (
            <Button
              variant="ghost"
              onClick={() => setConfirmingDelete(true)}
              disabled={isSaving}
              className="text-danger-700 hover:bg-danger-50"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Hapus
            </Button>
          ) : (
            <span />
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button variant="secondary" onClick={onClose} disabled={isSaving}>
              Tutup
            </Button>
            <Button onClick={() => void save()} disabled={isSaving || !hasChanges}>
              {isSaving ? "Menyimpan…" : "Simpan perubahan"}
            </Button>
          </div>
        </div>
      }
    >
      {isLoading ? (
        <p className="py-10 text-center text-sm text-ink-500">Memuat detail…</p>
      ) : error && !detail ? (
        <p role="alert" className="rounded-[var(--radius-field)] bg-danger-50 p-3 text-sm text-danger-700">
          {error}
        </p>
      ) : detail ? (
        <div className="flex flex-col gap-6">
          {confirmingDelete ? (
            <div className="rounded-[var(--radius-field)] border border-danger-300 bg-danger-50 p-4">
              <p className="text-sm font-semibold text-danger-800">
                Hapus pengajuan ini beserta seluruh dokumennya?
              </p>
              <p className="mt-1 text-xs leading-relaxed text-danger-700">
                Foto KTP, SIM, Kartu Keluarga, dan selfie akan ikut dihapus permanen
                dari penyimpanan. Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => void remove()}
                  disabled={isSaving}
                  className="bg-danger-600 hover:bg-danger-700"
                >
                  Ya, hapus permanen
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setConfirmingDelete(false)}>
                  Batal
                </Button>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={detail.status} />
            <span className="text-xs text-ink-500">
              Masuk {formatDateID(detail.submittedAt.slice(0, 10))}
            </span>
            {detail.reviewedBy ? (
              <span className="text-xs text-ink-500">· Ditangani {detail.reviewedBy}</span>
            ) : null}
          </div>

          <Section title="Data penyewa">
            <Row label="Nama lengkap" value={detail.fullName} />
            <Row label="Email" value={detail.email} href={`mailto:${detail.email}`} />
            <Row
              label="WhatsApp"
              value={detail.whatsapp}
              href={`https://wa.me/${detail.whatsapp}`}
              icon={<MessageCircle className="size-3.5" aria-hidden="true" />}
            />
            <Row label="Nomor GSM" value={detail.gsmNumber} />
            <Row label="Nomor darurat" value={detail.emergencyNumber} />
            <Row label="Alamat tinggal" value={detail.address} />
          </Section>

          <Section title="Detail sewa">
            <Row
              label="Jenis mobil"
              value={displayVehicle(detail)}
            />
            <Row label="Driver" value={detail.withDriver ? "Dengan driver" : "Lepas kunci"} />
            <Row
              label="Mulai"
              value={`${formatDateID(detail.startDate)}, ${detail.startTime} WIB`}
            />
            <Row label="Durasi" value={`${detail.durationDays} hari`} />
            <Row label="Tujuan" value={detail.purpose} />
            <Row label="Lokasi penggunaan" value={detail.usageLocation} />
            <Row
              label="Mengetahui JGS dari"
              value={labelForChoice(
                referralChoices,
                detail.referralSource,
                detail.referralSourceOther,
              )}
            />
          </Section>

          <section>
            <h3 className="text-sm font-bold tracking-tight text-ink-900">
              Dokumen ({detail.documents.length})
            </h3>
            <p className="mt-1 text-xs text-ink-500">
              Tautan berlaku sekitar 15 menit, lalu perlu dibuka ulang dari sini.
            </p>

            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {detail.documents.map((document) => (
                <li key={document.slot}>
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-[var(--radius-field)] border border-ink-200 bg-white p-3 transition-colors hover:border-ink-300 hover:bg-ink-50"
                  >
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
                      <FileText className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink-900">
                        {documentLabels.get(document.slot) ?? document.slot}
                      </span>
                      <span className="block text-xs text-ink-500">
                        {formatBytes(document.sizeBytes)}
                      </span>
                    </span>
                    <ExternalLink className="size-4 shrink-0 text-ink-400" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="application-status"
                className="block text-sm font-medium text-ink-800"
              >
                Status
              </label>
              <Select
                id="application-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as ApplicationStatus)}
                className="mt-1.5"
              >
                {applicationStatuses.map((value) => (
                  <option key={value} value={value}>
                    {statusLabels[value]}
                  </option>
                ))}
              </Select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="application-note"
                className="block text-sm font-medium text-ink-800"
              >
                Catatan internal
              </label>
              <Textarea
                id="application-note"
                rows={3}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Hasil verifikasi, kesepakatan deposit, atau alasan penolakan."
                className="mt-1.5"
              />
              <p className="mt-1 text-xs text-ink-500">
                Hanya terlihat oleh tim. Tidak pernah dikirim ke penyewa.
              </p>
            </div>
          </section>

          {error ? (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-[var(--radius-field)] bg-danger-50 p-3 text-sm text-danger-700"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          ) : null}
        </div>
      ) : null}
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-sm font-bold tracking-tight text-ink-900">{title}</h3>
      <dl className="mt-2 divide-y divide-ink-100 rounded-[var(--radius-field)] border border-ink-200">
        {children}
      </dl>
    </section>
  );
}

function Row({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="grid gap-0.5 px-3.5 py-2.5 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-xs text-ink-500 sm:text-sm">{label}</dt>
      <dd className="text-sm font-medium break-words text-ink-900">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-brand-700 hover:underline"
          >
            {icon}
            {value}
          </a>
        ) : (
          value || "—"
        )}
      </dd>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
