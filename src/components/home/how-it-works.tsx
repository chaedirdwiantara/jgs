import { ClipboardList, MessageCircle, CarFront } from "lucide-react";

import { Container, Section, SectionHeading } from "@/components/ui/section";

const steps = [
  {
    icon: ClipboardList,
    title: "Isi detail sewa",
    description:
      "Pilih jenis layanan, isi data pemesan, lokasi, dan jadwal. Tidak perlu membuat akun.",
  },
  {
    icon: CarFront,
    title: "Pilih armada",
    description:
      "Kami tampilkan unit yang tersedia di lokasi Anda beserta kapasitas dan estimasi tarifnya.",
  },
  {
    icon: MessageCircle,
    title: "Konfirmasi via WhatsApp",
    description:
      "Ringkasan pesanan terkirim otomatis ke admin. Ketersediaan dan harga final dikonfirmasi langsung.",
  },
];

export function HowItWorks() {
  return (
    <Section className="bg-ink-50">
      <Container>
        <SectionHeading
          eyebrow="Cara Kerja"
          title="Tiga langkah, selesai dalam hitungan menit"
          description="Alur pemesanan dirancang sesingkat mungkin — tanpa registrasi dan tanpa pembayaran di muka."
          align="center"
        />

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, ...step }, index) => (
            <li
              key={step.title}
              className="relative flex flex-col rounded-[var(--radius-card)] border border-ink-200 bg-white p-6 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span
                  aria-hidden="true"
                  className="text-4xl font-extrabold leading-none text-ink-100"
                >
                  {index + 1}
                </span>
              </div>

              <h3 className="mt-5 text-base font-bold text-ink-900">
                <span className="sr-only">Langkah {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
