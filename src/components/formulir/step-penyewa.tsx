"use client";

import type { UseFormReturn } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { OTHER_OPTION, socialPlatformChoices } from "@/data/rental-form-options";
import type { RentalFormValues } from "@/features/rental-form/schema";

/** What "just the username" looks like on each platform. */
const accountPlaceholders: Record<string, string> = {
  instagram: "budi.santoso",
  tiktok: "@budisantoso",
  facebook: "budi.santoso",
};

/**
 * Step 1 — who is renting and how to reach them.
 *
 * Three phone numbers is not a mistake: the operator asks for a WhatsApp line,
 * a second GSM line, and a next-of-kin number, and uses all three when a unit
 * is out.
 */
export function StepPenyewa({ form }: { form: UseFormReturn<RentalFormValues> }) {
  const { register, watch, formState } = form;
  const { errors } = formState;

  /*
   * The account field follows the platform: what counts as a valid username is
   * platform-specific, and "@budisantoso" in the box is a clearer instruction
   * than any sentence about it.
   */
  const socialPlatform = watch("socialPlatform");
  const isOtherPlatform = socialPlatform === OTHER_OPTION;

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
        htmlFor="socialPlatform"
        label="Media sosial"
        hint="Dipakai tim kami untuk verifikasi."
        error={errors.socialPlatform?.message}
      >
        <Select
          id="socialPlatform"
          invalid={Boolean(errors.socialPlatform)}
          aria-describedby={
            errors.socialPlatform ? "socialPlatform-error" : "socialPlatform-hint"
          }
          {...register("socialPlatform")}
        >
          <option value="">Pilih platform</option>
          {socialPlatformChoices.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        htmlFor="socialAccount"
        label="Username atau link profil"
        hint={
          isOtherPlatform
            ? "Tempel link profil akun Anda."
            : "Tempel link profil, atau cukup username-nya."
        }
        error={errors.socialAccount?.message}
      >
        <Input
          id="socialAccount"
          type="text"
          inputMode="url"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          // Falls back to a full address for "Lainnya" and before a platform is
          // picked, which are exactly the cases a username cannot be resolved in.
          placeholder={accountPlaceholders[socialPlatform] ?? "https://instagram.com/budi.santoso"}
          invalid={Boolean(errors.socialAccount)}
          aria-describedby={
            errors.socialAccount ? "socialAccount-error" : "socialAccount-hint"
          }
          {...register("socialAccount")}
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
