import { BadgeCheck, Headphones, Leaf, ReceiptText, Sparkles, Wrench } from "lucide-react";

import { Container, Section, SectionHeading } from "@/components/ui/section";

const reasons = [
  {
    icon: Leaf,
    title: "Nol emisi knalpot",
    description:
      "Seluruh armada berbasis listrik, sehingga perjalanan Anda tidak menghasilkan emisi gas buang.",
  },
  {
    icon: ReceiptText,
    title: "Harga transparan",
    description:
      "Estimasi biaya tampil sebelum Anda memesan, dan harga final dikonfirmasi sebelum pembayaran.",
  },
  {
    icon: Wrench,
    title: "Perawatan berkala",
    description:
      "Setiap unit melewati pemeriksaan kondisi baterai, ban, dan kebersihan kabin sebelum diserahkan.",
  },
  {
    icon: BadgeCheck,
    title: "Driver profesional",
    description:
      "Driver terlatih, berseragam, dan terbiasa melayani tamu korporat maupun keluarga.",
  },
  {
    icon: Headphones,
    title: "Dukungan 24/7",
    description:
      "Tim kami siap dihubungi kapan pun selama masa sewa, termasuk bantuan pengisian daya.",
  },
  {
    icon: Sparkles,
    title: "Kabin senyap",
    description:
      "Tanpa getaran dan suara mesin — cocok untuk rapat di jalan maupun perjalanan panjang.",
  },
];

export function WhyUs() {
  return (
    <Section className="bg-ink-50">
      <Container>
        <SectionHeading
          eyebrow="Keunggulan"
          title="Alasan pelanggan memilih kami"
          description="Kami menyederhanakan sewa kendaraan listrik tanpa mengorbankan standar layanan."
        />

        <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(({ icon: Icon, ...reason }) => (
            <li key={reason.title} className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-soft">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-base font-bold text-ink-900">{reason.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  {reason.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
