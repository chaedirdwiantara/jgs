import type { Metadata } from "next";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CreditCard,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import { incidentRules, rentalSteps } from "@/data/rental-terms";
import { serviceAreaLabel } from "@/data/service-areas";
import { getVehicles } from "@/data/vehicles";
import {
  DEPOSIT_DP,
  REPAIR_COST_PER_PANEL,
  SECURITY_DEPOSIT,
} from "@/features/booking/constants";
import { formatIDR } from "@/lib/format";

export const metadata: Metadata = {
  title: "Cara Sewa & Ketentuan",
  description:
    "Langkah penyewaan di JGS: syarat dokumen, DP, pelunasan, deposit jaminan, serta ketentuan yang berlaku bila terjadi insiden.",
  alternates: { canonical: "/cara-sewa" },
};

const incidentIcons = [ShieldCheck, Wrench, CreditCard];

export default function CaraSewaPage() {
  const vehicles = getVehicles();

  return (
    <>
      <section className="border-b border-ink-100 bg-linear-to-b from-brand-50 to-white">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
            Cara Sewa
          </p>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Lima langkah sampai unit di tangan Anda
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-600 sm:text-base">
            Tanpa akun, tanpa aplikasi. Semua dikonfirmasi lewat WhatsApp, dan unit
            diantar di area {serviceAreaLabel}.
          </p>
          <ButtonLink href="/sewa-mobil" size="lg" className="mt-7 w-full sm:w-auto">
            Mulai pesan
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </Container>
      </section>

      {/* --- Langkah penyewaan -------------------------------------------- */}
      <Section>
        <Container>
          <h2 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
            Langkah penyewaan
          </h2>

          <ol className="mt-8 flex flex-col gap-4">
            {rentalSteps.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-[var(--radius-card)] border border-ink-200 bg-white p-5 shadow-soft sm:gap-5 sm:p-6"
              >
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white"
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-ink-900">
                    <span className="sr-only">Langkah {index + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-600">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* The two figures every renter asks about, pulled out of the prose. */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <PaymentCard
              icon={CreditCard}
              label="DP untuk mengunci unit"
              amount={DEPOSIT_DP}
              note="Dibayar setelah data terverifikasi. Sisanya dilunasi saat serah terima."
            />
            <PaymentCard
              icon={BadgeCheck}
              label="Deposit jaminan"
              amount={SECURITY_DEPOSIT}
              note="Dikembalikan penuh bila unit kembali dalam kondisi baik dan tanpa e-tilang."
            />
          </div>
        </Container>
      </Section>

      {/* --- Ketentuan insiden -------------------------------------------- */}
      <Section className="bg-ink-50">
        <Container>
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger-50 text-danger-600">
              <AlertTriangle className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
                Jika terjadi insiden
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-600">
                Ketentuan ini berlaku untuk kerusakan yang terjadi selama unit berada
                dalam penguasaan penyewa.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {incidentRules.map((rule, index) => {
              const Icon = incidentIcons[index] ?? ShieldCheck;

              return (
                <div
                  key={rule.title}
                  className="rounded-[var(--radius-card)] border border-ink-200 bg-white p-5 shadow-soft"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink-900">{rule.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    {rule.description}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-4 rounded-[var(--radius-card)] border border-ink-200 bg-white p-5 text-[15px] leading-relaxed text-ink-700">
            Biaya perbaikan{" "}
            <strong className="font-semibold text-ink-900">
              {formatIDR(REPAIR_COST_PER_PANEL)} per panel
            </strong>{" "}
            bodi yang terdampak.
          </p>

          {/* --- Downtime ---------------------------------------------------
           * Per-unit and taken straight from the vehicle data, so adding a car
           * in /admin cannot leave this table behind.
           */}
          <div className="mt-8">
            <h3 className="font-semibold text-ink-900">
              Biaya downtime selama unit di bengkel
            </h3>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-600">
              Dihitung per hari, selama unit tidak dapat disewakan karena menjalani
              perbaikan.
            </p>

            <div className="mt-4 overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-white shadow-soft">
              <table className="w-full border-collapse text-left text-sm">
                <caption className="sr-only">
                  Biaya downtime harian per unit armada
                </caption>
                <thead>
                  <tr className="border-b border-ink-200 bg-ink-50 text-xs uppercase tracking-wider text-ink-500">
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Unit
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">
                      Biaya per hari
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className="border-b border-ink-100 last:border-0"
                    >
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-ink-900"
                      >
                        {vehicle.name}
                      </th>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-ink-900">
                        {formatIDR(vehicle.downtimeRate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </Section>

      <Container className="pb-16 sm:pb-20">
        <div className="rounded-[var(--radius-card)] border border-ink-200 bg-ink-50 p-5 text-sm leading-relaxed text-ink-600">
          <strong className="font-semibold text-ink-900">Catatan.</strong> Seluruh
          tarif yang tampil belum termasuk PPN. Unit dapat diambil di garasi kami,{" "}
          {siteConfig.contact.address} ({siteConfig.contact.addressLandmark}), atau
          diantar ke alamat Anda — disepakati bersama admin lewat WhatsApp.
        </div>
      </Container>
    </>
  );
}

function PaymentCard({
  icon: Icon,
  label,
  amount,
  note,
}: {
  icon: typeof CreditCard;
  label: string;
  amount: number;
  note: string;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-ink-200 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm text-ink-600">{label}</p>
          <p className="text-lg font-extrabold tracking-tight text-ink-900">
            {formatIDR(amount)}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-600">{note}</p>
    </div>
  );
}
