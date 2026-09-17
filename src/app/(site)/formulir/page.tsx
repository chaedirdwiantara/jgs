import type { Metadata } from "next";
import { CameraIcon, FileCheck2, ShieldCheck, Timer } from "lucide-react";

import { RentalForm } from "@/components/formulir/rental-form";
import { Container } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Formulir Data Penyewa",
  description:
    "Lengkapi data diri dan dokumen persyaratan untuk menyewa mobil listrik JGS, dengan atau tanpa driver. Verifikasi diproses tim kami lewat WhatsApp.",
  alternates: { canonical: "/formulir" },
  /*
   * The page collects identity documents. It is linked from the site and from
   * WhatsApp, but there is nothing here worth ranking — and a search result
   * pointing at an upload form invites the wrong kind of traffic.
   */
  robots: { index: false, follow: true },
};

const assurances = [
  { icon: Timer, label: "Sekitar 5 menit" },
  { icon: CameraIcon, label: "Foto langsung dari kamera HP" },
  { icon: ShieldCheck, label: "Dokumen disimpan terenkripsi" },
  { icon: FileCheck2, label: "Dikonfirmasi lewat WhatsApp" },
];

export default function FormulirPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-linear-to-b from-brand-50 to-white">
        <Container className="py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
            Pendaftaran penyewa
          </p>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Formulir Data Penyewa
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-600 sm:text-base">
            Lengkapi data diri, detail sewa, dan dokumen persyaratan. Tim JGS akan
            memverifikasi lalu menghubungi Anda melalui WhatsApp untuk konfirmasi
            unit dan jadwal serah terima.
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5">
            {assurances.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-ink-600">
                <Icon className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="py-10 sm:py-14">
        <RentalForm />
      </Container>
    </>
  );
}
