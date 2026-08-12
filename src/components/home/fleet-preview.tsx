import { ArrowRight } from "lucide-react";

import { VehicleCard } from "@/components/booking/vehicle-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section, SectionHeading } from "@/components/ui/section";
import { getVehicles } from "@/data/vehicles";

export function FleetPreview() {
  const vehicles = getVehicles().slice(0, 3);

  return (
    <Section className="bg-white">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Armada"
            title="Unit populer minggu ini"
            description="Setiap unit dirawat berkala dan diserahkan dalam kondisi baterai penuh."
            className="max-w-xl"
          />
          <ButtonLink href="/armada" variant="secondary" className="shrink-0 self-start sm:self-auto">
            Lihat semua armada
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              serviceType="rental-harian"
              showAction={false}
            />
          ))}
        </div>

        <p className="mt-6 text-xs text-ink-500">
          Harga adalah estimasi awal untuk sewa harian. Harga final dan ketersediaan
          unit dikonfirmasi oleh admin melalui WhatsApp.
        </p>
      </Container>
    </Section>
  );
}
