"use client";

import { AlertCircle, ScrollText } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import {
  documentSlots,
  lepasKunciRules,
  labelForChoice,
  referralChoices,
  vehicleChoices,
} from "@/data/rental-form-options";
import type { RentalFormValues } from "@/features/rental-form/schema";
import type { DocumentState } from "@/features/rental-form/use-rental-form";
import { formatDateID } from "@/lib/format";
import { cn } from "@/lib/utils";

type StepKonfirmasiProps = {
  form: UseFormReturn<RentalFormValues>;
  documents: Record<string, DocumentState>;
  onEditStep: (index: number) => void;
};

export function StepKonfirmasi({ form, documents, onEditStep }: StepKonfirmasiProps) {
  const { register, watch, formState } = form;
  const { errors } = formState;
  const values = watch();

  const uploaded = documentSlots.filter((slot) => documents[slot.key]?.status === "done");
  const withDriver = values.driver === "ya";

  return (
    <div className="flex flex-col gap-6">
      <ReviewCard title="Data penyewa" onEdit={() => onEditStep(0)}>
        <ReviewRow label="Nama lengkap" value={values.fullName} />
        <ReviewRow label="Email" value={values.email} />
        <ReviewRow label="WhatsApp" value={values.whatsapp} />
        <ReviewRow label="Nomor GSM" value={values.gsmNumber} />
        <ReviewRow label="Nomor darurat" value={values.emergencyNumber} />
        <ReviewRow label="Alamat tinggal" value={values.address} />
      </ReviewCard>

      <ReviewCard title="Detail sewa" onEdit={() => onEditStep(1)}>
        <ReviewRow
          label="Jenis mobil"
          value={labelForChoice(vehicleChoices, values.vehicleChoice, values.vehicleOther)}
        />
        <ReviewRow label="Driver" value={withDriver ? "Dengan driver" : "Tanpa driver (lepas kunci)"} />
        <ReviewRow label="Mulai" value={`${formatDateID(values.startDate)}, ${values.startTime} WIB`} />
        <ReviewRow label="Durasi" value={`${values.durationDays} hari`} />
        <ReviewRow label="Tujuan" value={values.purpose} />
        <ReviewRow label="Lokasi penggunaan" value={values.usageLocation} />
        <ReviewRow
          label="Mengetahui JGS dari"
          value={labelForChoice(
            referralChoices,
            values.referralSource,
            values.referralSourceOther,
          )}
        />
      </ReviewCard>

      <ReviewCard title="Dokumen" onEdit={() => onEditStep(2)}>
        <ReviewRow
          label="Terunggah"
          value={`${uploaded.length} berkas — ${uploaded.map((slot) => slot.label).join(", ")}`}
        />
      </ReviewCard>

      {/*
        The rules are shown in full rather than behind a link: the renter is
        about to agree to them, and a deposit and a damage liability are not
        things to bury one click away.
      */}
      <section className="rounded-[var(--radius-card)] border border-ink-200 bg-white p-5 shadow-soft">
        <h3 className="flex items-center gap-2 text-sm font-bold tracking-tight text-ink-900">
          <ScrollText className="size-4 text-brand-600" aria-hidden="true" />
          Peraturan Sewa Mobil Lepas Kunci
        </h3>

        {withDriver ? (
          <p className="mt-2 text-xs text-ink-500">
            Anda memilih sewa dengan driver. Peraturan di bawah berlaku untuk sewa
            lepas kunci — dicantumkan agar Anda tetap mengetahuinya bila kemudian
            beralih.
          </p>
        ) : null}

        <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed text-ink-700 marker:font-semibold marker:text-ink-400">
          {lepasKunciRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
      </section>

      <div>
        <label
          htmlFor="agreement"
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-[var(--radius-field)] border p-4 transition-colors",
            errors.agreement
              ? "border-danger-300 bg-danger-50/50"
              : "border-ink-200 bg-white hover:bg-ink-50",
          )}
        >
          <input
            id="agreement"
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 accent-brand-600"
            aria-describedby={errors.agreement ? "agreement-error" : undefined}
            {...register("agreement")}
          />
          <span className="text-sm leading-relaxed text-ink-700">
            Saya menyatakan data dan dokumen di atas benar, dan saya menyetujui
            peraturan sewa serta penggunaan data saya untuk verifikasi penyewaan.
          </span>
        </label>

        {errors.agreement ? (
          <p
            id="agreement-error"
            role="alert"
            className="mt-2 flex items-start gap-1.5 text-xs text-danger-600"
          >
            <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
            {errors.agreement.message}
          </p>
        ) : null}
      </div>

      {/*
        Honeypot. Positioned off-screen rather than `display:none`, which the
        crawlers that bother checking will skip. Never focusable, never read out.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute left-[-9999px] opacity-0">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>
    </div>
  );
}

function ReviewCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-card)] border border-ink-200 bg-white shadow-soft">
      <header className="flex items-center justify-between gap-3 border-b border-ink-200 px-5 py-3">
        <h3 className="text-sm font-bold tracking-tight text-ink-900">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50"
        >
          Ubah
        </button>
      </header>
      <dl className="divide-y divide-ink-100">{children}</dl>
    </section>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-0.5 px-5 py-2.5 sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="text-xs text-ink-500 sm:text-sm">{label}</dt>
      <dd className="text-sm font-medium break-words text-ink-900">{value || "—"}</dd>
    </div>
  );
}
