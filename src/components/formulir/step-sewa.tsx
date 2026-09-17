"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { Input, Select } from "@/components/ui/input";
import { RadioCards } from "@/components/ui/radio-cards";
import {
  driverChoices,
  OTHER_OPTION,
  referralChoices,
  vehicleChoices,
} from "@/data/rental-form-options";
import { todayISO } from "@/lib/format";
import { maxStartDate, type RentalFormValues } from "@/features/rental-form/schema";

/**
 * Selectable rental lengths.
 *
 * Every day up to a fortnight, then the round numbers people actually ask for.
 * A 1–90 dropdown would be ninety options nobody scrolls; a free number field
 * invites "1.5".
 */
const DURATION_OPTIONS = [...Array.from({ length: 14 }, (_, index) => index + 1), 21, 30, 45, 60, 90];

export function StepSewa({ form }: { form: UseFormReturn<RentalFormValues> }) {
  const { register, control, watch, formState } = form;
  const { errors } = formState;

  const vehicleChoice = watch("vehicleChoice");
  const referralSource = watch("referralSource");

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          htmlFor="purpose"
          label="Tujuan menyewa mobil"
          hint="Contoh: perjalanan keluarga, dinas kantor, acara pernikahan."
          error={errors.purpose?.message}
        >
          <Input
            id="purpose"
            placeholder="Perjalanan keluarga"
            invalid={Boolean(errors.purpose)}
            aria-describedby={errors.purpose ? "purpose-error" : "purpose-hint"}
            {...register("purpose")}
          />
        </Field>

        <Field
          htmlFor="usageLocation"
          label="Lokasi penggunaan mobil"
          hint="Kota atau rute yang akan ditempuh."
          error={errors.usageLocation?.message}
        >
          <Input
            id="usageLocation"
            placeholder="Jakarta – Bandung"
            invalid={Boolean(errors.usageLocation)}
            aria-describedby={errors.usageLocation ? "usageLocation-error" : "usageLocation-hint"}
            {...register("usageLocation")}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field htmlFor="startDate" label="Tanggal penyewaan" error={errors.startDate?.message}>
          <Input
            id="startDate"
            type="date"
            min={todayISO()}
            max={maxStartDate()}
            invalid={Boolean(errors.startDate)}
            aria-describedby={errors.startDate ? "startDate-error" : undefined}
            {...register("startDate")}
          />
        </Field>

        <Field
          htmlFor="startTime"
          label="Jam mulai sewa"
          hint="WIB."
          error={errors.startTime?.message}
        >
          <Input
            id="startTime"
            type="time"
            step={300}
            invalid={Boolean(errors.startTime)}
            aria-describedby={errors.startTime ? "startTime-error" : "startTime-hint"}
            {...register("startTime")}
          />
        </Field>

        <Field
          htmlFor="durationDays"
          label="Durasi penyewaan"
          error={errors.durationDays?.message}
        >
          <Select
            id="durationDays"
            invalid={Boolean(errors.durationDays)}
            aria-describedby={errors.durationDays ? "durationDays-error" : undefined}
            {...register("durationDays")}
          >
            {DURATION_OPTIONS.map((days) => (
              <option key={days} value={days}>
                {days} hari
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div>
        <Controller
          control={control}
          name="vehicleChoice"
          render={({ field }) => (
            <RadioCards
              name="vehicleChoice"
              legend="Jenis mobil"
              columns={3}
              options={vehicleChoices}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.vehicleChoice ? (
          <p role="alert" className="mt-2 text-xs text-danger-600">
            {errors.vehicleChoice.message}
          </p>
        ) : null}

        {vehicleChoice === OTHER_OPTION ? (
          <Field
            htmlFor="vehicleOther"
            label="Tuliskan jenis mobil"
            error={errors.vehicleOther?.message}
            className="mt-3 max-w-sm"
          >
            <Input
              id="vehicleOther"
              placeholder="Contoh: BYD Dolphin"
              invalid={Boolean(errors.vehicleOther)}
              aria-describedby={errors.vehicleOther ? "vehicleOther-error" : undefined}
              {...register("vehicleOther")}
            />
          </Field>
        ) : null}
      </div>

      <div>
        <Controller
          control={control}
          name="driver"
          render={({ field }) => (
            <RadioCards
              name="driver"
              legend="Pakai driver?"
              columns={2}
              options={[
                {
                  ...driverChoices[0]!,
                  description: "Anda menyetir sendiri. Berlaku peraturan lepas kunci.",
                },
                {
                  ...driverChoices[1]!,
                  description: "Driver JGS yang membawa unit selama masa sewa.",
                },
              ]}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.driver ? (
          <p role="alert" className="mt-2 text-xs text-danger-600">
            {errors.driver.message}
          </p>
        ) : null}
      </div>

      <div>
        <Controller
          control={control}
          name="referralSource"
          render={({ field }) => (
            <RadioCards
              name="referralSource"
              legend="Darimana Anda mengetahui JGS?"
              columns={3}
              options={referralChoices}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.referralSource ? (
          <p role="alert" className="mt-2 text-xs text-danger-600">
            {errors.referralSource.message}
          </p>
        ) : null}

        {referralSource === OTHER_OPTION ? (
          <Field
            htmlFor="referralSourceOther"
            label="Tuliskan sumbernya"
            error={errors.referralSourceOther?.message}
            className="mt-3 max-w-sm"
          >
            <Input
              id="referralSourceOther"
              placeholder="Contoh: Google Maps"
              invalid={Boolean(errors.referralSourceOther)}
              aria-describedby={
                errors.referralSourceOther ? "referralSourceOther-error" : undefined
              }
              {...register("referralSourceOther")}
            />
          </Field>
        ) : null}
      </div>
    </div>
  );
}
