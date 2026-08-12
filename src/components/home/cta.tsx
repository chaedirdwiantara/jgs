import { ArrowRight, Phone } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { siteConfig } from "@/config/site";

export function Cta() {
  return (
    <section className="bg-white pb-16 sm:pb-20 lg:pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-[1.75rem] bg-ink-950 px-6 py-12 text-white sm:px-10 sm:py-16">
          <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-30" />
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 size-96 rounded-full bg-brand-600/30 blur-3xl"
          />

          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                Siap berangkat dengan mobil listrik?
              </h2>
              <p className="mt-3 text-pretty text-[15px] leading-relaxed text-ink-300 sm:text-base">
                Kirim detail perjalanan Anda sekarang. Tim kami mengonfirmasi
                ketersediaan unit dan harga final dalam waktu singkat.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <ButtonLink href="/sewa-mobil" size="lg">
                Pesan Sekarang
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                size="lg"
                variant="secondary"
                className="border-0 bg-white/10 text-white ring-white/20 hover:bg-white/15 hover:ring-white/30"
              >
                <Phone className="size-4" aria-hidden="true" />
                Hubungi Kami
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
