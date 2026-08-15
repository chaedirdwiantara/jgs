import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { VehicleCard } from "@/components/booking/vehicle-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { getLocations } from "@/data/locations";
import { getVehicles, tierLabels, type VehicleTier } from "@/data/vehicles";

export const metadata: Metadata = {
  title: "Armada Mobil Listrik",
  description:
    "Daftar lengkap armada kendaraan listrik yang tersedia untuk rental harian dan antar-jemput bandara, beserta kapasitas dan estimasi tarifnya.",
  alternates: { canonical: "/armada" },
};

const tierOrder: VehicleTier[] = ["economy", "premium", "elite"];

const tierDescriptions: Record<VehicleTier, string> = {
  economy: "Efisien dan lincah — pilihan tepat untuk mobilitas harian di dalam kota.",
  premium: "Kabin lebih lapang dan senyap, cocok untuk tamu bisnis dan perjalanan jauh.",
  elite: "Kenyamanan kelas satu untuk rombongan, keluarga besar, atau tamu VIP.",
};

export default function ArmadaPage() {
  const vehicles = getVehicles();
  const locations = getLocations();

  return (
    <>
      <section className="border-b border-ink-100 bg-linear-to-b from-brand-50 to-white">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
            Armada
          </p>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Pilih unit yang paling sesuai
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-600 sm:text-base">
            Seluruh armada kami berbasis listrik dan tersedia di {locations.length} titik
            layanan. Ketersediaan unit berbeda di tiap lokasi — periksa saat memesan.
          </p>
          <ButtonLink href="/sewa-mobil" size="lg" className="mt-7 w-full sm:w-auto">
            Cek ketersediaan
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </Container>
      </section>

      {tierOrder.map((tier, index) => {
        const items = vehicles.filter((vehicle) => vehicle.tier === tier);
        if (items.length === 0) return null;

        return (
          <Section
            key={tier}
            className={index % 2 === 0 ? "bg-white" : "bg-ink-50"}
          >
            <Container>
              <h2 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
                {tierLabels[tier]}
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-600">
                {tierDescriptions[tier]}
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    serviceType="rental-harian"
                    showAction={false}
                  />
                ))}
              </div>
            </Container>
          </Section>
        );
      })}

      <Container className="pb-16 sm:pb-20">
        <div className="rounded-[var(--radius-card)] border border-ink-200 bg-ink-50 p-5 text-sm leading-relaxed text-ink-600">
          <strong className="font-semibold text-ink-900">Catatan harga.</strong> Tarif
          yang tampil adalah estimasi awal untuk sewa harian dan dapat berubah mengikuti
          durasi, lokasi, serta ketersediaan unit. Harga final selalu dikonfirmasi oleh
          admin melalui WhatsApp sebelum pemesanan disahkan.
        </div>
      </Container>
    </>
  );
}
