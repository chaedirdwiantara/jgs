"use client";

import Image from "next/image";
import { BatteryCharging, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

import { tierLabels, type Vehicle } from "@/data/vehicles";
import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Long enough to read the caption, short enough to see a second unit. */
const INTERVAL_MS = 5500;

type HeroCarouselProps = {
  vehicles: Vehicle[];
};

/**
 * Auto-advancing fleet showcase inside the hero's stacked glass frame.
 *
 * Rotation stops on hover, on keyboard focus, when the tab is backgrounded, and
 * whenever the visitor prefers reduced motion. The visible pause control is what
 * satisfies WCAG 2.2.2 — hover and focus alone leave touch users with no way out.
 */
export function HeroCarousel({ vehicles }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Rotating in a background tab burns cycles and desyncs the caption from what
  // the visitor last saw.
  useEffect(() => {
    const sync = () => setTabHidden(document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  const rotating =
    playing && !interacting && !tabHidden && !reducedMotion && vehicles.length > 1;

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % vehicles.length),
      INTERVAL_MS,
    );
    return () => window.clearInterval(timer);
  }, [rotating, vehicles.length]);

  if (vehicles.length === 0) return null;

  const active = vehicles[index];

  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* Offset card behind the frame — the stacked-paper depth cue. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -rotate-3 rounded-[2rem] bg-white/5 ring-1 ring-inset ring-white/10"
      />

      <div className="relative rounded-[2rem] bg-linear-to-br from-white/12 to-white/5 p-4 ring-1 ring-inset ring-white/15 backdrop-blur-sm sm:p-6">
        <section
          aria-roledescription="carousel"
          aria-label="Armada Jagayanigiri"
          onMouseEnter={() => setInteracting(true)}
          onMouseLeave={() => setInteracting(false)}
          onFocusCapture={() => setInteracting(true)}
          onBlurCapture={() => setInteracting(false)}
        >
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-ink-950 ring-1 ring-inset ring-white/10">
            {vehicles.map((vehicle, slide) => {
              const current = slide === index;

              return (
                <div
                  key={vehicle.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${slide + 1} dari ${vehicles.length}: ${vehicle.name}`}
                  aria-hidden={!current}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-700 ease-[var(--ease-out-soft)]",
                    current ? "opacity-100" : "opacity-0",
                  )}
                >
                  <Image
                    src={vehicle.photo}
                    alt={`Foto ${vehicle.name}`}
                    fill
                    sizes="(min-width: 1024px) 32rem, (min-width: 640px) 60vw, 90vw"
                    /* Only the first slide is above the fold on load. */
                    priority={slide === 0}
                    className="object-cover"
                  />

                  {/* Scrim so the caption stays legible over any photograph. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-ink-950/95 via-ink-950/50 to-transparent"
                  />

                  <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-x-3 gap-y-1 p-4 sm:p-5">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">
                        {tierLabels[vehicle.tier]}
                      </p>
                      <p className="mt-1 truncate text-base font-bold text-white sm:text-lg">
                        {vehicle.name}
                      </p>
                    </div>

                    <p className="shrink-0 text-right text-xs text-ink-300">
                      mulai dari
                      <span className="ml-1.5 text-sm font-bold text-white">
                        {formatIDR(vehicle.dailyRate)}
                      </span>
                      <span className="text-ink-400">/hari</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <ul className="flex items-center gap-2" role="list">
              {vehicles.map((vehicle, slide) => {
                const current = slide === index;

                return (
                  <li key={vehicle.id}>
                    <button
                      type="button"
                      onClick={() => setIndex(slide)}
                      aria-label={`Tampilkan ${vehicle.name}`}
                      aria-current={current ? "true" : undefined}
                      className={cn(
                        "h-2 rounded-full transition-[width,background-color] duration-300 ease-[var(--ease-out-soft)]",
                        current
                          ? "w-6 bg-brand-500"
                          : "w-2 bg-white/30 hover:bg-white/60",
                      )}
                    />
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              // With reduced motion the carousel never rotates, so offering a
              // pause control would be a lie.
              hidden={reducedMotion || vehicles.length < 2}
              aria-label={playing ? "Hentikan pergantian foto" : "Jalankan pergantian foto"}
              className="inline-flex size-8 items-center justify-center rounded-full text-ink-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {playing ? (
                <Pause className="size-3.5 fill-current" aria-hidden="true" />
              ) : (
                <Play className="size-3.5 fill-current" aria-hidden="true" />
              )}
            </button>
          </div>
        </section>

        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-ink-950/50 p-4 ring-1 ring-inset ring-white/10">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300">
            <BatteryCharging className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">Baterai penuh saat serah terima</p>
            <p className="text-xs text-ink-400">Peta SPKLU rute Anda kami siapkan.</p>
          </div>
        </div>
      </div>

      {/*
       * The slides all stay mounted, so toggling opacity alone announces
       * nothing. This status text does change, which is what screen readers
       * actually react to. APG: stay silent while rotating on its own, and
       * announce only once the visitor is the one driving.
       */}
      <p className="sr-only" aria-live={rotating ? "off" : "polite"}>
        {`Menampilkan ${active.name}, ${index + 1} dari ${vehicles.length}.`}
      </p>
    </div>
  );
}
