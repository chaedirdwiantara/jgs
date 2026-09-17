"use client";

import type { UseFormReturn } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import type { RentalFormValues } from "@/features/rental-form/schema";

/**
 * Step 1 — who is renting and how to reach them.
 *
 * Three phone numbers is not a mistake: the operator asks for a WhatsApp line,
 * a second GSM line, and a next-of-kin number, and uses all three when a unit
 * is out.
 */
export function StepPenyewa({ form }: { form: UseFormReturn<RentalFormValues> }) {
  const { register, formState } = form;
  const { errors } = formState;

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field
        htmlFor="fullName"
        label="Nama lengkap"
        hint="Sesuai KTP."
        error={errors.fullName?.message}
        className="sm:col-span-2"
      >
        <Input
          id="fullName"
          autoComplete="name"
          placeholder="Contoh: Budi Santoso"
          invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? "fullName-error" : "fullName-hint"}
          {...register("fullName")}
        />
      </Field>

      <Field htmlFor="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="nama@email.com"
          invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
      </Field>

      <Field
        htmlFor="whatsapp"
        label="Nomor WhatsApp"
        hint="Nomor aktif yang kami hubungi."
        error={errors.whatsapp?.message}
      >
        <Input
          id="whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0811803090"
          invalid={Boolean(errors.whatsapp)}
          aria-describedby={errors.whatsapp ? "whatsapp-error" : "whatsapp-hint"}
          {...register("whatsapp")}
        />
      </Field>

      <Field
        htmlFor="gsmNumber"
        label="Nomor GSM"
        hint="Nomor kedua, boleh sama dengan WhatsApp."
        error={errors.gsmNumber?.message}
      >
        <Input
          id="gsmNumber"
          type="tel"
          inputMode="tel"
          placeholder="0811803090"
          invalid={Boolean(errors.gsmNumber)}
          aria-describedby={errors.gsmNumber ? "gsmNumber-error" : "gsmNumber-hint"}
          {...register("gsmNumber")}
        />
      </Field>

      <Field
        htmlFor="emergencyNumber"
        label="Nomor darurat"
        hint="Suami/istri, kakak, atau adik."
        error={errors.emergencyNumber?.message}
      >
        <Input
          id="emergencyNumber"
          type="tel"
          inputMode="tel"
          placeholder="0811803090"
          invalid={Boolean(errors.emergencyNumber)}
          aria-describedby={
            errors.emergencyNumber ? "emergencyNumber-error" : "emergencyNumber-hint"
          }
          {...register("emergencyNumber")}
        />
      </Field>

      <Field
        htmlFor="address"
        label="Alamat tinggal"
        hint="Alamat tempat Anda tinggal saat ini, bukan alamat KTP bila berbeda."
        error={errors.address?.message}
        className="sm:col-span-2"
      >
        <Textarea
          id="address"
          rows={3}
          autoComplete="street-address"
          placeholder="Nama jalan, nomor, RT/RW, kelurahan, kecamatan, kota"
          invalid={Boolean(errors.address)}
          aria-describedby={errors.address ? "address-error" : "address-hint"}
          {...register("address")}
        />
      </Field>
    </div>
  );
}
