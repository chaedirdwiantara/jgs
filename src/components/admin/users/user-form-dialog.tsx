"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { RadioCards } from "@/components/ui/radio-cards";
import { describeError, RepositoryError } from "@/features/admin/repository";
import {
  roleDescriptions,
  roleLabels,
  userRoles,
  type AdminUser,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/features/admin/types";

const PASSWORD_MIN = 12;

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .pipe(z.email("Format email tidak valid")),
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80, "Nama maksimal 80 karakter"),
  role: z.enum(userRoles, { error: "Pilih peran pengguna" }),
  /*
   * Optional on edit — an empty box means "leave the password alone". On create
   * the dialog pre-fills a generated one, so it is never actually blank there.
   */
  password: z
    .string()
    .refine(
      (value) => value.length === 0 || value.length >= PASSWORD_MIN,
      `Kata sandi minimal ${PASSWORD_MIN} karakter`,
    ),
  isActive: z.boolean(),
});

type Values = z.infer<typeof schema>;

type Props = {
  open: boolean;
  /** `null` = creating a new account. */
  user: AdminUser | null;
  onClose: () => void;
  onCreate: (input: CreateUserInput) => Promise<void>;
  onUpdate: (id: string, patch: UpdateUserInput) => Promise<void>;
};

/**
 * Passwords are generated rather than invented.
 *
 * The owner creates an account for a colleague and reads the password out once;
 * a box they have to fill themselves reliably produces the shop's street name.
 */
function generatePassword(): string {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function UserFormDialog({ open, user, onClose, onCreate, onUpdate }: Props) {
  const isEditing = user !== null;

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", name: "", role: "staff", password: "", isActive: true },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!open) return;

    reset(
      user
        ? {
            email: user.email,
            name: user.name,
            role: user.role,
            password: "",
            isActive: user.isActive,
          }
        : {
            email: "",
            name: "",
            role: "staff",
            password: generatePassword(),
            isActive: true,
          },
    );
  }, [open, user, reset]);

  const submit = handleSubmit(async (values) => {
    try {
      if (user) {
        const patch: UpdateUserInput = {
          name: values.name,
          role: values.role,
          isActive: values.isActive,
        };
        if (values.password) patch.password = values.password;
        await onUpdate(user.id, patch);
      } else {
        await onCreate({
          email: values.email,
          name: values.name,
          role: values.role,
          password: values.password,
        });
      }
      onClose();
    } catch (cause) {
      if (cause instanceof RepositoryError && cause.fieldErrors) {
        for (const [field, message] of Object.entries(cause.fieldErrors)) {
          if (field === "email" || field === "name" || field === "password") {
            setError(field, { type: "server", message });
          }
        }
        if (Object.keys(cause.fieldErrors).length > 0) return;
      }
      setError("root", { type: "server", message: describeError(cause) });
    }
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Ubah pengguna" : "Tambah pengguna"}
      description={
        isEditing
          ? "Email tidak dapat diubah. Kosongkan kata sandi bila tidak ingin menggantinya."
          : "Akun baru langsung aktif dan dapat masuk ke konsol."
      }
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button onClick={() => void submit()} disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan…" : isEditing ? "Simpan" : "Tambah pengguna"}
          </Button>
        </div>
      }
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <Field htmlFor="user-name" label="Nama" error={errors.name?.message}>
          <Input
            id="user-name"
            autoComplete="off"
            placeholder="Contoh: Siti Rahayu"
            invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "user-name-error" : undefined}
            {...register("name")}
          />
        </Field>

        <Field
          htmlFor="user-email"
          label="Email"
          hint={isEditing ? "Email dipakai untuk masuk dan tidak dapat diubah." : undefined}
          error={errors.email?.message}
        >
          <Input
            id="user-email"
            type="email"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            disabled={isEditing}
            placeholder="nama@jgs-ev.com"
            invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "user-email-error" : "user-email-hint"}
            {...register("email")}
          />
        </Field>

        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <RadioCards
              name="role"
              legend="Peran"
              columns={2}
              options={userRoles.map((role) => ({
                value: role,
                label: roleLabels[role],
                description: roleDescriptions[role],
              }))}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Field
          htmlFor="user-password"
          label={isEditing ? "Kata sandi baru" : "Kata sandi"}
          hint={
            isEditing
              ? "Kosongkan untuk mempertahankan kata sandi saat ini."
              : "Salin dan berikan kepada pemilik akun. Minta mereka menggantinya setelah masuk."
          }
          error={errors.password?.message}
        >
          <div className="flex gap-2">
            <Input
              id="user-password"
              type="text"
              autoComplete="off"
              spellCheck={false}
              className="font-mono text-sm"
              placeholder={isEditing ? "(tidak diubah)" : undefined}
              invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "user-password-error" : "user-password-hint"}
              {...register("password")}
            />
            <Button
              variant="secondary"
              onClick={() => setValue("password", generatePassword(), { shouldValidate: true })}
              aria-label="Buat kata sandi acak"
              className="shrink-0"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </Field>

        {/*
          Shown in clear text on purpose: this is the one moment the owner can
          copy it. It is never displayed again after the dialog closes.
        */}
        {!isEditing ? (
          <p className="rounded-[var(--radius-field)] bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
            Kata sandi ini hanya tampil sekarang. Simpan atau kirimkan sebelum
            menutup dialog.
          </p>
        ) : null}

        {/*
          Deactivating is the reversible alternative to deleting: the account
          keeps its history but stops being able to sign in. Only offered on an
          existing account — a new one is always created active.
        */}
        {isEditing ? (
          <label
            htmlFor="user-active"
            className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-field)] border border-ink-200 p-3.5 transition-colors hover:bg-ink-50"
          >
            <input
              id="user-active"
              type="checkbox"
              className="mt-0.5 size-5 shrink-0 accent-brand-600"
              {...register("isActive")}
            />
            <span>
              <span className="block text-sm font-semibold text-ink-900">Akun aktif</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                Hapus centang untuk menonaktifkan tanpa menghapus. Sesi yang sedang
                berjalan langsung ditolak pada permintaan berikutnya.
              </span>
            </span>
          </label>
        ) : null}

        {errors.root ? (
          <p
            role="alert"
            className="rounded-[var(--radius-field)] bg-danger-50 p-3 text-sm text-danger-700"
          >
            {errors.root.message}
          </p>
        ) : null}
      </form>
    </Modal>
  );
}
