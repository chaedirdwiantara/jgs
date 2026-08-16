import Link from "next/link";
import { ClipboardList, MessageCircle, CarFront } from "lucide-react";

import { Container, Section, SectionHeading } from "@/components/ui/section";

const steps = [
  {
    icon: ClipboardList,
    title: "Isi detail sewa",
    description:
      "Masukkan data pemesan, tanggal mulai, dan lama sewa. Tidak perlu membuat akun.",
  },
  {
    icon: CarFront,
    title: "Pilih armada",
    description:
      "Kami tampilkan unit yang tersedia beserta kapasitas dan estimasi tarifnya.",
  },
  {
    icon: MessageCircle,
    title: "Konfirmasi via WhatsApp",
    description:
      "Ringkasan pesanan terkirim otomatis ke admin. Ketersediaan, harga final, DP, dan deposit dikonfirmasi langsung.",
  },
];

export function HowItWorks() {
  return (
    <Section className="bg-ink-50">
      <Container>
        <SectionHeading
          eyebrow="Cara Kerja"
          title="Tiga langkah, selesai dalam hitungan menit"
          /*
           * Deliberately no longer claims "tanpa pembayaran di muka": booking a
           * unit now requires a DP once the documents are verified.
           */
          description="Memesan lewat situs tidak perlu registrasi. Verifikasi dokumen, DP, dan deposit diurus admin setelah pesanan masuk."
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

        <p className="mt-8 text-center text-sm text-ink-600">
          Syarat dokumen, DP, deposit, dan ketentuan bila terjadi insiden ada di{" "}
          <Link
            href="/cara-sewa"
            className="font-semibold text-brand-600 underline underline-offset-4 hover:text-brand-700"
          >
            halaman Cara Sewa
          </Link>
          .
        </p>
      </Container>
    </Section>
  );
}
