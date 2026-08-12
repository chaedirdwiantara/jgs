import { ArrowRight, BatteryCharging, Leaf, Star } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { getLowestDailyRate } from "@/data/vehicles";
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
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
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

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-8">
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

          <div className="relative hidden lg:block">
            <HeroArtwork />
          </div>
        </div>
      </Container>
    </section>
  );
}

function HeroArtwork() {
  return (
    <div className="relative mx-auto max-w-lg">
      <div className="absolute inset-0 -rotate-3 rounded-[2rem] bg-white/5 ring-1 ring-inset ring-white/10" />
      <div className="relative rounded-[2rem] bg-linear-to-br from-white/12 to-white/5 p-8 ring-1 ring-inset ring-white/15 backdrop-blur-sm">
        <svg viewBox="0 0 320 180" className="w-full" role="img" aria-label="Ilustrasi mobil listrik">
          <ellipse cx="160" cy="150" rx="128" ry="10" fill="#ffffff" opacity="0.06" />
          <path
            d="M42 124c-9 0-14-5-14-13 0-11 6-17 18-20l24-6 22-21c6-6 14-9 23-9h50c10 0 19 4 26 11l19 19 25 6c13 3 20 10 20 21 0 8-5 12-14 12H42Z"
            fill="#12b285"
          />
          <path
            d="M104 84 121 67c3-3 7-5 11-5h22v22h-50Zm60-22h20c5 0 10 2 14 6l16 16h-50V62Z"
            fill="#022c23"
            opacity="0.9"
          />
          <rect x="252" y="102" width="26" height="7" rx="3.5" fill="#ffffff" opacity="0.9" />
          <g fill="#0a0f18">
            <circle cx="96" cy="126" r="23" />
            <circle cx="230" cy="126" r="23" />
          </g>
          <g fill="#f7f8fa">
            <circle cx="96" cy="126" r="9" />
            <circle cx="230" cy="126" r="9" />
          </g>
        </svg>

        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-ink-950/50 p-4 ring-1 ring-inset ring-white/10">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300">
            <BatteryCharging className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Baterai penuh saat serah terima</p>
            <p className="text-xs text-ink-400">Peta SPKLU rute Anda kami siapkan.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
