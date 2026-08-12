import type { Metadata } from "next";
import { ArrowRight, Building2, Leaf, Target } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Container, Section, SectionHeading } from "@/components/ui/section";
import { getLocations } from "@/data/locations";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: `Profil ${siteConfig.legalName}, penyedia layanan sewa mobil listrik untuk rental harian dan antar-jemput bandara di Indonesia.`,
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
  const locations = getLocations();

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
            title="Titik layanan kami"
            description="Armada tersedia di bandara utama dan pool kota. Ketersediaan unit per lokasi dapat dilihat saat memesan."
          />

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <li
                key={location.id}
                className="rounded-[var(--radius-card)] border border-ink-200 bg-white p-5 shadow-soft"
              >
                <h3 className="text-base font-semibold text-ink-900">{location.name}</h3>
                <p className="mt-1 text-sm text-ink-500">{location.area}</p>
                <p className="mt-3 text-sm text-ink-600">
                  {location.vehicleIds.length} unit tersedia
                </p>
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
