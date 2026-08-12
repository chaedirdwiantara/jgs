"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, CarFront } from "lucide-react";

import { BookingRecap } from "@/components/booking/booking-recap";
import { VehicleCard } from "@/components/booking/vehicle-card";
import { Button } from "@/components/ui/button";
import type { Location } from "@/data/locations";
import type { Vehicle } from "@/data/vehicles";
import { filterBySeats } from "@/features/booking/availability";
import type { BookingDetails } from "@/features/booking/types";
import { cn } from "@/lib/utils";

type Props = {
  details: BookingDetails;
  location?: Location;
  vehicles: Vehicle[];
  selectedVehicleId: string;
  onSelect: (id: string) => void;
  onBack: () => void;
};

const SEAT_FILTERS = [
  { value: 0, label: "Semua" },
  { value: 4, label: "4+ kursi" },
  { value: 5, label: "5+ kursi" },
  { value: 7, label: "7 kursi" },
];

export function StepVehicle({
  details,
  location,
  vehicles,
  selectedVehicleId,
  onSelect,
  onBack,
}: Props) {
  const [minSeats, setMinSeats] = useState(0);

  const visible = useMemo(
    () => filterBySeats(vehicles, minSeats),
    [vehicles, minSeats],
  );

  return (
    <div className="flex flex-col gap-6">
      <BookingRecap details={details} location={location} onEdit={onBack} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-ink-900">
            Armada tersedia{location ? ` di ${location.name}` : ""}
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            {visible.length} unit ditemukan. Harga adalah estimasi awal.
          </p>
        </div>

        <div
          role="group"
          aria-label="Filter kapasitas kursi"
          className="flex flex-wrap gap-1.5 rounded-full bg-ink-100 p-1"
        >
          {SEAT_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setMinSeats(filter.value)}
              aria-pressed={minSeats === filter.value}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                minSeats === filter.value
                  ? "bg-white text-ink-900 shadow-xs"
                  : "text-ink-500 hover:text-ink-800",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              serviceType={details.serviceType}
              selected={vehicle.id === selectedVehicleId}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : (
        <EmptyState hasLocation={Boolean(location)} onBack={onBack} />
      )}

      <div>
        <Button variant="secondary" onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke detail
        </Button>
      </div>
    </div>
  );
}

function EmptyState({
  hasLocation,
  onBack,
}: {
  hasLocation: boolean;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-dashed border-ink-300 bg-ink-50 px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-white text-ink-400 shadow-soft">
        <CarFront className="size-6" aria-hidden="true" />
      </span>
      <div>
        <p className="font-semibold text-ink-900">
          {hasLocation
            ? "Tidak ada unit yang cocok dengan filter"
            : "Lokasi belum dipilih"}
        </p>
        <p className="mt-1 max-w-sm text-sm text-ink-500">
          {hasLocation
            ? "Coba longgarkan filter kapasitas kursi, atau pilih lokasi layanan lain."
            : "Kembali ke langkah sebelumnya untuk memilih lokasi layanan."}
        </p>
      </div>
      <Button variant="secondary" onClick={onBack}>
        Ubah detail sewa
      </Button>
    </div>
  );
}
