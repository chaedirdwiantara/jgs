import { ArrowRight, Leaf, Star } from "lucide-react";

import { HeroCarousel } from "@/components/home/hero-carousel";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { getLowestDailyRate, getVehicles } from "@/data/vehicles";
import { formatIDR } from "@/lib/format";

const stats = [
  { value: "100%", label: "Armada listrik" },
  { value: "5", label: "Titik layanan" },
  { value: "24/7", label: "Dukungan pelanggan" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-40" />
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-40 size-[36rem] rounded-full bg-brand-600/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-56 -left-32 size-[30rem] rounded-full bg-brand-500/15 blur-3xl"
      />

      <Container className="relative py-16 sm:py-20 lg:py-28">
        {/*
         * Three cells rather than two columns of stacked content, so the source
         * order can be copy → carousel → stats. On a phone that puts a car on
         * screen right after the call to action; on `lg` the explicit
         * row/column placement rebuilds the original two-column layout.
         */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0">
          <div className="lg:col-start-1 lg:row-start-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-brand-200 ring-1 ring-inset ring-white/15">
              <Leaf className="size-3.5" aria-hidden="true" />
              Nol emisi, nol kebisingan
            </span>

            <h1 className="mt-5 text-balance text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              Sewa mobil listrik untuk perjalanan yang lebih tenang
            </h1>

            <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-300 sm:text-lg">
              Rental harian dan antar-jemput bandara dengan armada 100% kendaraan
              listrik. Pilih unit, kirim pesanan lewat WhatsApp, kami urus sisanya.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/sewa-mobil" size="lg" className="sm:w-auto">
                Mulai Pesan
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink
                href="/armada"
                size="lg"
                variant="secondary"
                className="border-0 bg-white/10 text-white ring-white/20 hover:bg-white/15 hover:ring-white/30"
              >
                Lihat Armada
              </ButtonLink>
            </div>

            <p className="mt-5 flex items-center gap-2 text-sm text-ink-400">
              <Star className="size-4 shrink-0 fill-brand-400 text-brand-400" aria-hidden="true" />
              Mulai dari{" "}
              <span className="font-semibold text-white">
                {formatIDR(getLowestDailyRate())}
              </span>{" "}
              per hari
            </p>

          </div>

          {/*
           * Rendered on mobile too: the fleet photos are the strongest reason to
           * keep scrolling, and hiding them left the small-screen hero as a wall
           * of text.
           */}
          <div className="relative lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            <HeroCarousel vehicles={getVehicles()} />
          </div>

          <dl className="grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-8 lg:col-start-1 lg:row-start-2 lg:mt-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-2xl font-extrabold tracking-tight text-white">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-ink-400">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
