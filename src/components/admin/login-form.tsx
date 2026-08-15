"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "@/features/admin/auth/auth-service";
import { describeError } from "@/features/admin/repository";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email wajib diisi").pipe(z.email("Format email tidak valid")),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const submit = handleSubmit(async (values) => {
    try {
      await signIn(values);
      // No redirect needed: `useAdminSession` observes the token and the
      // console replaces this form in place.
    } catch (cause) {
      setError("root", { type: "server", message: describeError(cause) });
    }
  });

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardBody className="sm:p-8">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>

          <h1 className="mt-4 text-xl font-bold tracking-tight text-ink-900">
            Masuk ke Konsol Admin
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            Gunakan akun admin yang terdaftar untuk mengelola data armada.
          </p>

          <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-4">
            <Field htmlFor="email" label="Email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
            </Field>

            <Field htmlFor="password" label="Kata sandi" error={errors.password?.message}>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                {...register("password")}
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

            <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
              {isSubmitting ? "Memproses…" : "Masuk"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
