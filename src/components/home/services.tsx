import Link from "next/link";
import { ArrowRight, CalendarRange, Check } from "lucide-react";

import { Container, Section, SectionHeading } from "@/components/ui/section";
import { serviceAreaLabel } from "@/data/service-areas";

const inclusions = [
  "Durasi 1–30 hari",
  "Lepas kunci atau dengan driver",
  "Unit diantar ke alamat Anda",
  "Tarif khusus sewa mingguan",
];

export function Services() {
  return (
    <Section className="bg-white">
      <Container>
        <SectionHeading
          eyebrow="Layanan"
          title="Cara kami melayani perjalanan Anda"
          description={`Kami fokus pada satu hal dan mengerjakannya dengan benar: rental harian mobil listrik untuk wilayah ${serviceAreaLabel}, dengan unit terawat dan proses pemesanan yang singkat.`}
        />

        {/*
         * A single service reads better as one wide panel than as a lone card
         * stranded in a multi-column grid: the split gives the copy room to
         * breathe on desktop and stacks cleanly on a phone.
         */}
        <div className="mt-10 overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-white shadow-soft">
          <div className="grid lg:grid-cols-5">
            <div className="p-6 sm:p-8 lg:col-span-3 lg:p-10">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <CalendarRange className="size-6" aria-hidden="true" />
              </span>

              <h3 className="mt-5 text-lg font-bold text-ink-900">Rental Harian</h3>
              <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-ink-600">
                Sewa unit per hari untuk kebutuhan pribadi maupun operasional
                perusahaan. Cukup tentukan tanggal mulai dan lama sewa — titik
                serah terima unit kami sepakati bersama lewat WhatsApp.
              </p>

              <Link
                href="/sewa-mobil"
                className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
              >
                Pesan layanan ini
                <ArrowRight
                  className="size-4 transition-transform duration-200 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <div className="border-t border-ink-200 bg-ink-50 p-6 sm:p-8 lg:col-span-2 lg:border-l lg:border-t-0 lg:p-10">
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                Yang Anda dapatkan
              </h4>
              <ul className="mt-5 space-y-3.5 text-[15px] leading-relaxed text-ink-700">
                {inclusions.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-brand-600"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
