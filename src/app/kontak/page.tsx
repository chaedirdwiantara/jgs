import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import { toWhatsAppNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Kontak",
  description: `Hubungi ${siteConfig.legalName} untuk pemesanan, sewa korporat, atau pertanyaan seputar armada mobil listrik.`,
  alternates: { canonical: "/kontak" },
};

const whatsappHref = `https://wa.me/${toWhatsAppNumber(siteConfig.contact.whatsapp)}?text=${encodeURIComponent(
  `Halo ${siteConfig.brandName}, saya ingin bertanya tentang sewa mobil listrik.`,
)}`;

const channels = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: siteConfig.contact.whatsapp,
    href: whatsappHref,
    external: true,
    description: "Jalur tercepat untuk pemesanan dan konfirmasi harga.",
  },
  {
    icon: Phone,
    label: "Telepon",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`,
    external: false,
    description: "Tersedia pada jam operasional kantor.",
  },
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    external: false,
    description: "Untuk penawaran korporat dan kerja sama.",
  },
];

export default function KontakPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-linear-to-b from-brand-50 to-white">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
            Kontak
          </p>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Kami siap membantu
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-600 sm:text-base">
            Pilih kanal yang paling nyaman untuk Anda. Untuk pemesanan, WhatsApp adalah
            jalur tercepat karena ringkasan pesanan terkirim otomatis.
          </p>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-1">
            {channels.map(({ icon: Icon, ...channel }) => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  target={channel.external ? "_blank" : undefined}
                  rel={channel.external ? "noopener noreferrer" : undefined}
                  className="flex h-full items-start gap-4 rounded-[var(--radius-card)] border border-ink-200 bg-white p-5 shadow-soft transition-[border-color,box-shadow,transform] duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-ink-500">{channel.label}</span>
                    <span className="mt-0.5 block break-words text-base font-semibold text-ink-900">
                      {channel.value}
                    </span>
                    <span className="mt-1 block text-sm text-ink-600">
                      {channel.description}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <aside className="lg:col-span-5">
            <div className="rounded-[var(--radius-card)] border border-ink-200 bg-ink-50 p-6">
              <h2 className="text-base font-bold text-ink-900">Kantor & Operasional</h2>

              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-700" aria-hidden="true" />
                  <div>
                    <dt className="text-ink-500">Alamat</dt>
                    <dd className="font-medium text-ink-900">{siteConfig.contact.address}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-brand-700" aria-hidden="true" />
                  <div>
                    <dt className="text-ink-500">Jam Operasional</dt>
                    <dd className="font-medium text-ink-900">
                      {siteConfig.contact.operationalHours}
                    </dd>
                  </div>
                </div>
              </dl>

              <ButtonLink href="/sewa-mobil" size="lg" fullWidth className="mt-6">
                Mulai pesan sekarang
              </ButtonLink>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
