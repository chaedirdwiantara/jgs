import type { Metadata } from "next";
import { ArrowRight, Building2, Leaf, MapPin, Target } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Container, Section, SectionHeading } from "@/components/ui/section";
import { serviceAreaLabel, serviceAreas } from "@/data/service-areas";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: `Profil ${siteConfig.legalName}, penyedia layanan sewa mobil listrik harian untuk wilayah ${serviceAreaLabel}.`,
  alternates: { canonical: "/tentang" },
};

const pillars = [
  {
    icon: Leaf,
    title: "Transportasi rendah emisi",
    description:
      "Kami mengoperasikan armada yang seluruhnya berbasis listrik, sehingga setiap perjalanan tidak menghasilkan emisi gas buang.",
  },
  {
    icon: Target,
    title: "Layanan yang sederhana",
    description:
      "Pemesanan tanpa akun, tanpa formulir panjang, dan tanpa biaya tersembunyi — cukup tiga langkah lalu konfirmasi via WhatsApp.",
  },
  {
    icon: Building2,
    title: "Siap melayani korporat",
    description:
      "Kami melayani penyewaan jangka panjang dan kebutuhan mobilitas tamu perusahaan dengan penagihan yang rapi.",
  },
];

export default function TentangPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-linear-to-b from-brand-50 to-white">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
            Tentang Kami
          </p>
          <h1 className="mt-3 max-w-3xl text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            {siteConfig.legalName}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-600 sm:text-lg">
            {siteConfig.description}
          </p>
        </Container>
      </section>

      <Section className="bg-white">
        <Container>
          <SectionHeading
            eyebrow="Prinsip Kami"
            title="Tiga hal yang kami pegang"
            description="Dasar dari cara kami membangun layanan dan merawat armada."
          />

          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {pillars.map(({ icon: Icon, ...pillar }) => (
              <li
                key={pillar.title}
                className="rounded-[var(--radius-card)] border border-ink-200 bg-white p-6 shadow-soft"
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-base font-bold text-ink-900">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {pillar.description}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="bg-ink-50">
        <Container>
          <SectionHeading
            eyebrow="Jangkauan"
            title={`Area layanan ${serviceAreaLabel}`}
            description="Kami beroperasi di wilayah Jabodetabek saja, sehingga unit dapat diantar dan dijemput tepat waktu. Titik serah terima disepakati bersama saat konfirmasi pesanan."
          />

          <ul className="mt-10 flex flex-wrap gap-3">
            {serviceAreas.map((area) => (
              <li
                key={area}
                className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-800 shadow-soft"
              >
                <MapPin className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
                {area}
              </li>
            ))}
          </ul>

          <ButtonLink href="/sewa-mobil" size="lg" className="mt-10 w-full sm:w-auto">
            Mulai pesan
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}
