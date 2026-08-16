"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Info } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { RadioCards } from "@/components/ui/radio-cards";
import { serviceAreaLabel } from "@/data/service-areas";
import {
  CUSTOMER_TYPES,
  DURATION_OPTIONS,
  MAX_LEAD_DAYS,
} from "@/features/booking/constants";
import { normalizeBookingDetails } from "@/features/booking/normalize";
import { bookingDetailsSchema } from "@/features/booking/schema";
import type { BookingDetails } from "@/features/booking/types";
import { addDaysISO, todayISO } from "@/lib/format";

type Props = {
  defaultValues: BookingDetails;
  onSubmit: (values: BookingDetails) => void;
};

export function StepDetails({ defaultValues, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BookingDetails>({
    resolver: zodResolver(bookingDetailsSchema),
    defaultValues,
    mode: "onTouched",
  });

  // `useWatch` (rather than `watch`) so the subscription is compiler-safe.
  const customerType = useWatch({ control, name: "customerType" });

  const minDate = todayISO();
  const maxDate = addDaysISO(minDate, MAX_LEAD_DAYS);

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(normalizeBookingDetails(values)))}
      noValidate
      className="flex flex-col gap-8"
    >
      {/* --- Data pemesan ---------------------------------------------- */}
      <FormSection title="Data Pemesan">
        <Controller
          control={control}
          name="customerType"
          render={({ field }) => (
            <RadioCards
              name="customerType"
              legend="Tipe Pelanggan"
              options={CUSTOMER_TYPES}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field htmlFor="fullName" label="Nama Lengkap" error={errors.fullName?.message}>
            <Input
              id="fullName"
              autoComplete="name"
              placeholder="Contoh: Budi Santoso"
              invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              {...register("fullName")}
            />
          </Field>

          <Field
            htmlFor="whatsapp"
            label="Nomor WhatsApp"
            hint="Konfirmasi pesanan dikirim ke nomor ini."
            error={errors.whatsapp?.message}
          >
            <Input
              id="whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="08123456789"
              invalid={Boolean(errors.whatsapp)}
              aria-describedby={
                errors.whatsapp ? "whatsapp-error" : "whatsapp-hint"
              }
              {...register("whatsapp")}
            />
          </Field>

          {customerType === "perusahaan" ? (
            <Field
              htmlFor="companyName"
              label="Nama Perusahaan"
              error={errors.companyName?.message}
              className="sm:col-span-2"
            >
              <Input
                id="companyName"
                autoComplete="organization"
                placeholder="Contoh: PT Sumber Makmur"
                invalid={Boolean(errors.companyName)}
                aria-describedby={errors.companyName ? "companyName-error" : undefined}
                {...register("companyName")}
              />
            </Field>
          ) : null}
        </div>
      </FormSection>

      {/* --- Jadwal ----------------------------------------------------- */}
      <FormSection
        title="Jadwal Sewa"
        description={`Tentukan tanggal mulai dan lama sewa. Titik serah terima unit di area ${serviceAreaLabel} kami sepakati bersama lewat WhatsApp.`}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            htmlFor="startDate"
            label="Tanggal Mulai"
            error={errors.startDate?.message}
          >
            <Input
              id="startDate"
              type="date"
              min={minDate}
              max={maxDate}
              invalid={Boolean(errors.startDate)}
              aria-describedby={errors.startDate ? "startDate-error" : undefined}
              {...register("startDate")}
            />
          </Field>

          <Field
            htmlFor="durationDays"
            label="Durasi Sewa"
            error={errors.durationDays?.message}
          >
            <Select
              id="durationDays"
              invalid={Boolean(errors.durationDays)}
              aria-describedby={errors.durationDays ? "durationDays-error" : undefined}
              {...register("durationDays", {
                setValueAs: (value) => (value === "" ? Number.NaN : Number(value)),
              })}
            >
              {DURATION_OPTIONS.map((days) => (
                <option key={days} value={days}>
                  {days} hari
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field
          htmlFor="notes"
          label="Catatan Tambahan"
          optional
          hint="Misalnya: alamat pengantaran, butuh child seat, dengan driver, atau permintaan khusus lain."
          error={errors.notes?.message}
        >
          <Textarea
            id="notes"
            placeholder="Tulis permintaan khusus Anda di sini…"
            invalid={Boolean(errors.notes)}
            aria-describedby={errors.notes ? "notes-error" : "notes-hint"}
            {...register("notes")}
          />
        </Field>
      </FormSection>

      <div className="flex items-start gap-3 rounded-[var(--radius-field)] bg-brand-50 p-4 text-sm text-brand-800">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p className="leading-relaxed">
          Tidak perlu membuat akun. Setelah memilih armada, pesanan Anda dikirim ke
          admin melalui WhatsApp untuk konfirmasi ketersediaan unit, harga final,
          dan titik serah terima.
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          Lanjut Pilih Armada
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="text-base font-bold text-ink-900">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-ink-500">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
