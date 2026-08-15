import { Suspense } from "react";
import type { Metadata } from "next";
import { BatteryCharging, MessageCircle, ShieldCheck } from "lucide-react";

import { BookingWizard } from "@/components/booking/booking-wizard";
import { Container } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Sewa Mobil Listrik",
  description:
    "Pesan mobil listrik dalam tiga langkah: isi detail sewa, pilih armada, lalu konfirmasi via WhatsApp. Tanpa akun, tanpa biaya tersembunyi.",
  alternates: { canonical: "/sewa-mobil" },
};

const assurances = [
  { icon: MessageCircle, label: "Tanpa akun, cukup WhatsApp" },
  { icon: BatteryCharging, label: "Unit diserahkan baterai penuh" },
  { icon: ShieldCheck, label: "Harga dikonfirmasi sebelum bayar" },
];

export default function SewaMobilPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-linear-to-b from-brand-50 to-white">
        <Container className="py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
            Pemesanan
          </p>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Sewa mobil listrik dalam 3 langkah
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-600 sm:text-base">
            Isi detail kebutuhan Anda, pilih armada yang tersedia di lokasi tersebut,
            lalu kirim ringkasan pesanan ke admin kami melalui WhatsApp.
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
        {/*
          `BookingWizard` reads `?layanan=` via `useSearchParams`, which needs a
          Suspense boundary so the rest of this page can still be prerendered to
          static HTML at build time.
        */}
        <Suspense fallback={<div className="min-h-[32rem]" aria-hidden="true" />}>
          <BookingWizard />
        </Suspense>
      </Container>
    </>
  );
}
