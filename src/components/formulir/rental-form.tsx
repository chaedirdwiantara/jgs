"use client";

import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Send } from "lucide-react";

import { StepDokumen } from "@/components/formulir/step-dokumen";
import { StepKonfirmasi } from "@/components/formulir/step-konfirmasi";
import { StepPenyewa } from "@/components/formulir/step-penyewa";
import { StepSewa } from "@/components/formulir/step-sewa";
import { Button, ButtonLink, buttonClasses } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import { siteConfig } from "@/config/site";
import { isBackendConfigured } from "@/config/api";
import { useRentalForm, wizardSteps } from "@/features/rental-form/use-rental-form";
import { buildWhatsAppUrl } from "@/lib/contact-links";

export function RentalForm() {
  const wizard = useRentalForm();

  if (wizard.result) return <SubmittedPanel referenceCode={wizard.result.referenceCode} />;

  if (!isBackendConfigured) return <OfflinePanel />;

  const isLastStep = wizard.stepIndex === wizardSteps.length - 1;
  const { errors, isSubmitting } = wizard.form.formState;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Stepper
        steps={[...wizardSteps]}
        current={wizard.stepIndex}
        onStepClick={wizard.goToStep}
      />

      <form
        onSubmit={(event) => {
          // Only the final step submits. Enter anywhere else advances instead,
          // which is what a multi-step form is expected to do.
          event.preventDefault();
          if (isLastStep) void wizard.submit();
          else void wizard.next();
        }}
        noValidate
        className="mt-6"
      >
        <Card>
          <CardBody className="sm:p-7">
            <h2 className="text-lg font-bold tracking-tight text-ink-900">
              {wizard.step.label}
            </h2>
            <p className="mt-1 text-sm text-ink-600">{wizard.step.hint}</p>

            <div className="relative mt-6">
              {wizard.step.id === "penyewa" ? <StepPenyewa form={wizard.form} /> : null}
              {wizard.step.id === "sewa" ? <StepSewa form={wizard.form} /> : null}
              {wizard.step.id === "dokumen" ? (
                <StepDokumen
                  documents={wizard.documents}
                  error={wizard.documentsError}
                  onSelect={(slot, file) => void wizard.selectDocument(slot, file)}
                  onRemove={wizard.removeDocument}
                />
              ) : null}
              {wizard.step.id === "konfirmasi" ? (
                <StepKonfirmasi
                  form={wizard.form}
                  documents={wizard.documents}
                  onEditStep={wizard.goToStep}
                />
              ) : null}
            </div>

            {errors.root ? (
              <p
                role="alert"
                className="mt-5 flex items-start gap-2 rounded-[var(--radius-field)] bg-danger-50 p-3 text-sm text-danger-700"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {errors.root.message}
              </p>
            ) : null}
          </CardBody>
        </Card>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            variant="secondary"
            size="lg"
            onClick={wizard.back}
            disabled={wizard.stepIndex === 0 || isSubmitting}
            className={wizard.stepIndex === 0 ? "sm:invisible" : undefined}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali
          </Button>

          {isLastStep ? (
            <Button type="submit" size="lg" disabled={isSubmitting || wizard.isUploading}>
              <Send className="size-4" aria-hidden="true" />
              {isSubmitting ? "Mengirim…" : "Kirim formulir"}
            </Button>
          ) : (
            <Button type="submit" size="lg">
              Lanjut
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          )}
        </div>

        {wizard.isUploading ? (
          <p className="mt-3 text-center text-xs text-ink-500">
            Menunggu unggahan selesai…
          </p>
        ) : null}
      </form>
    </div>
  );
}

function SubmittedPanel({ referenceCode }: { referenceCode: string }) {
  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardBody className="text-center sm:p-8">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </span>

        <h2 className="mt-4 text-xl font-bold tracking-tight text-ink-900">
          Formulir terkirim
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          Tim JGS akan memverifikasi data Anda dan menghubungi lewat WhatsApp.
          Simpan kode di bawah untuk memudahkan saat menanyakan status.
        </p>

        <p className="mt-5 rounded-[var(--radius-field)] bg-ink-50 px-4 py-3 font-mono text-lg font-semibold tracking-wider text-ink-900">
          {referenceCode}
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <ButtonLink href="/" variant="secondary" size="lg">
            Kembali ke beranda
          </ButtonLink>
          <a
            href={buildWhatsAppUrl(
              `Halo ${siteConfig.brandName}, saya baru mengirim formulir penyewa dengan kode ${referenceCode}.`,
            )}
            target="_blank"
            rel="noreferrer"
            className={buttonClasses({ variant: "whatsapp", size: "lg" })}
          >
            Hubungi admin
          </a>
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * Shown when the site was built without `NEXT_PUBLIC_API_BASE_URL`.
 *
 * A form that silently discards a renter's KTP is worse than no form, so the
 * page refuses to collect anything and points at WhatsApp instead.
 */
function OfflinePanel() {
  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardBody className="text-center sm:p-8">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-amber-50 text-amber-700">
          <AlertCircle className="size-7" aria-hidden="true" />
        </span>

        <h2 className="mt-4 text-xl font-bold tracking-tight text-ink-900">
          Formulir online belum aktif
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          Untuk sementara, pendaftaran penyewa dilakukan lewat WhatsApp admin.
          Tim kami akan memandu dokumen apa saja yang perlu dikirim.
        </p>

        <div className="mt-6">
          <a
            href={buildWhatsAppUrl(
              `Halo ${siteConfig.brandName}, saya ingin mendaftar sebagai penyewa.`,
            )}
            target="_blank"
            rel="noreferrer"
            className={buttonClasses({ variant: "whatsapp", size: "lg" })}
          >
            Hubungi {siteConfig.brandName} di WhatsApp
          </a>
        </div>
      </CardBody>
    </Card>
  );
}
