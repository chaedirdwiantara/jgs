import Link from "next/link";
import { ArrowRight, CalendarRange, PlaneLanding } from "lucide-react";

import { Container, Section, SectionHeading } from "@/components/ui/section";

const services = [
  {
    icon: CalendarRange,
    title: "Rental Harian",
    description:
      "Sewa unit per hari untuk kebutuhan pribadi maupun operasional perusahaan. Tersedia lepas kunci atau dengan driver.",
    points: ["Durasi 1–30 hari", "Antar unit ke alamat Anda", "Tarif khusus sewa mingguan"],
    href: "/sewa-mobil?layanan=rental-harian",
  },
  {
    icon: PlaneLanding,
    title: "Antar-Jemput Bandara",
    description:
      "Penjemputan tepat waktu di terminal kedatangan, lengkap dengan driver profesional dan bantuan bagasi.",
    points: ["Sekali jalan atau pulang-pergi", "Pemantauan jadwal penerbangan", "Titik jemput di 5 lokasi"],
    href: "/sewa-mobil?layanan=antar-jemput",
  },
];

export function Services() {
  return (
    <Section className="bg-white">
      <Container>
        <SectionHeading
          eyebrow="Layanan"
          title="Dua cara memakai armada kami"
          description="Pilih layanan yang paling sesuai dengan rencana perjalanan Anda. Keduanya memakai alur pemesanan yang sama."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:gap-6">
          {services.map(({ icon: Icon, ...service }) => (
            <Link
              key={service.title}
              href={service.href}
              className="group flex flex-col rounded-[var(--radius-card)] border border-ink-200 bg-white p-6 shadow-soft transition-[border-color,box-shadow,transform] duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift sm:p-8"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <Icon className="size-6" aria-hidden="true" />
              </span>

              <h3 className="mt-5 text-lg font-bold text-ink-900">{service.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
                {service.description}
              </p>

              <ul className="mt-5 space-y-2 text-sm text-ink-600">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500"
                    />
                    {point}
                  </li>
                ))}
              </ul>

              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                Pesan layanan ini
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
