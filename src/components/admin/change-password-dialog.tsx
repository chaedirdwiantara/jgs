"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { changeOwnPassword } from "@/features/admin/auth/auth-service";
import { describeError, RepositoryError } from "@/features/admin/repository";

/** Mirrors the API: length is the rule, composition is not. */
const schema = z
  .object({
    currentPassword: z.string().min(1, "Kata sandi saat ini wajib diisi"),
    newPassword: z.string().min(12, "Kata sandi baru minimal 12 karakter"),
    confirmPassword: z.string().min(1, "Ulangi kata sandi baru"),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi kata sandi tidak sama",
  });

type Values = z.infer<typeof schema>;

const empty: Values = { currentPassword: "", newPassword: "", confirmPassword: "" };

export function ChangePasswordDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: empty, mode: "onTouched" });

  // A dialog that reopens holding the previous attempt's values — or its error
  // banner — looks like it never closed.
  useEffect(() => {
    if (open) reset(empty);
  }, [open, reset]);

  const submit = handleSubmit(async (values) => {
    try {
      await changeOwnPassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      onClose();
    } catch (cause) {
      if (cause instanceof RepositoryError && cause.fieldErrors?.currentPassword) {
        setError("currentPassword", {
          type: "server",
          message: cause.fieldErrors.currentPassword,
        });
        return;
      }
      setError("root", { type: "server", message: describeError(cause) });
    }
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ubah kata sandi"
      description="Sesi di perangkat lain tidak ikut keluar — keluar manual bila perlu."
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button
            onClick={() => void submit()}
            disabled={isSubmitting || isSubmitSuccessful}
          >
            {isSubmitting ? "Menyimpan…" : "Simpan"}
          </Button>
        </div>
      }
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <Field
          htmlFor="currentPassword"
          label="Kata sandi saat ini"
          error={errors.currentPassword?.message}
        >
          <Input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            invalid={Boolean(errors.currentPassword)}
            aria-describedby={errors.currentPassword ? "currentPassword-error" : undefined}
            {...register("currentPassword")}
          />
        </Field>

        <Field
          htmlFor="newPassword"
          label="Kata sandi baru"
          hint="Minimal 12 karakter. Gunakan frasa yang mudah Anda ingat."
          error={errors.newPassword?.message}
        >
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            invalid={Boolean(errors.newPassword)}
            aria-describedby={errors.newPassword ? "newPassword-error" : "newPassword-hint"}
            {...register("newPassword")}
          />
        </Field>

        <Field
          htmlFor="confirmPassword"
          label="Ulangi kata sandi baru"
          error={errors.confirmPassword?.message}
        >
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            {...register("confirmPassword")}
          />
        </Field>

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
