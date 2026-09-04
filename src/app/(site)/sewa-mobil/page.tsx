import type { Metadata } from "next";
import { BatteryCharging, MapPin, MessageCircle, ShieldCheck } from "lucide-react";

import { BookingWizard } from "@/components/booking/booking-wizard";
import { FaqSection } from "@/components/faq/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/section";
import { bookingFaqItems } from "@/data/faq";
import { serviceAreaLabel } from "@/data/service-areas";
import { faqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Sewa Mobil Listrik",
  description:
    "Pesan mobil listrik dalam tiga langkah: isi detail sewa, pilih armada, lalu konfirmasi via WhatsApp. Tanpa akun, tanpa biaya tersembunyi.",
  alternates: { canonical: "/sewa-mobil" },
};

const assurances = [
  { icon: MessageCircle, label: "Tanpa akun, cukup WhatsApp" },
  { icon: MapPin, label: `Area layanan ${serviceAreaLabel}` },
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
            Isi detail kebutuhan Anda, pilih armada yang tersedia, lalu kirim
            ringkasan pesanan ke admin kami melalui WhatsApp.
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
        <BookingWizard />
      </Container>

      {/*
       * Below the wizard on purpose: the form is what people came for; the
       * FAQ answers the doubts that stop them from finishing it. The WhatsApp
       * button is hidden on this route, so the section's own WhatsApp link
       * is the fallback for anything the answers do not cover.
       */}
      <FaqSection
        eyebrow="FAQ Pemesanan"
        title="Pertanyaan seputar pemesanan"
        items={bookingFaqItems}
        className="border-t border-ink-100 bg-ink-50"
      />

      <JsonLd data={faqPageJsonLd(bookingFaqItems)} />
    </>
  );
}
