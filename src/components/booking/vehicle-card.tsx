"use client";

import { BatteryCharging, Briefcase, Check, Users } from "lucide-react";

import { FleetPhoto } from "@/components/fleet/fleet-photo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { tierLabels, type Vehicle } from "@/data/vehicles";
import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  vehicle: Vehicle;
  selected?: boolean;
  onSelect?: (id: string) => void;
  /** Read-only variant used on the marketing pages. */
  showAction?: boolean;
};

export function VehicleCard({
  vehicle,
  selected = false,
  onSelect,
  showAction = true,
}: Props) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border bg-white transition-[border-color,box-shadow,transform] duration-200 ease-[var(--ease-out-soft)]",
        selected
          ? "border-brand-500 shadow-lift ring-2 ring-brand-500/25"
          : "border-ink-200 shadow-soft hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-lift",
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-ink-100 sm:aspect-16/10">
        <FleetPhoto photos={vehicle.photos.studio} alt={`Foto ${vehicle.name}`} />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge tone="brand">{tierLabels[vehicle.tier]}</Badge>
        </div>
        {selected ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white shadow-soft">
            <Check className="size-3.5" aria-hidden="true" />
            Dipilih
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-ink-900">{vehicle.name}</h3>

        <dl className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-600">
          <Spec icon={<Users className="size-4" />} label="Kursi">
            {vehicle.seats} kursi
          </Spec>
          <Spec icon={<Briefcase className="size-4" />} label="Bagasi">
            {vehicle.luggage} bagasi
          </Spec>
          <Spec icon={<BatteryCharging className="size-4" />} label="Jarak tempuh">
            ±{vehicle.rangeKm} km
          </Spec>
        </dl>

        <ul className="mt-4 space-y-1.5 text-sm text-ink-600">
          {vehicle.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden="true" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-ink-100 pt-4">
          <div>
            <p className="text-xs text-ink-500">Mulai dari</p>
            <p className="text-lg font-extrabold tracking-tight text-ink-900">
              {formatIDR(vehicle.dailyRate)}
              <span className="ml-1 text-sm font-medium text-ink-500">/ hari</span>
            </p>
            {/* The monthly column is a different rate, not a multiple of the daily one. */}
            <p className="mt-0.5 text-xs text-ink-500">
              atau{" "}
              <span className="font-semibold text-ink-700">
                {formatIDR(vehicle.monthlyRate)}
              </span>{" "}
              / bulan
            </p>
          </div>

          {showAction ? (
            <Button
              variant={selected ? "secondary" : "primary"}
              onClick={() => onSelect?.(vehicle.id)}
              aria-label={`Pilih ${vehicle.name}`}
            >
              {selected ? "Dipilih" : "Pesan"}
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Spec({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-ink-400" aria-hidden="true">
        {icon}
      </span>
      <dt className="sr-only">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
