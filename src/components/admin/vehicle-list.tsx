"use client";

import Image from "next/image";
import { BatteryCharging, Briefcase, Pencil, Trash2, Users } from "lucide-react";

import { Badge } from "@/components/ui/card";
import { accentLabels, tierLabels, type Vehicle } from "@/data/vehicles";
import { formatIDR } from "@/lib/format";

type VehicleListProps = {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  /** Dims the list and blocks actions while a write is in flight. */
  busy: boolean;
};

/**
 * One dataset, two presentations: a table from `md` up, stacked cards below.
 *
 * A table squeezed onto a phone forces horizontal scrolling and hides the
 * actions column, which is exactly the column an operator needs.
 */
export function VehicleList({ vehicles, onEdit, onDelete, busy }: VehicleListProps) {
  return (
    <div
      className={
        busy ? "pointer-events-none opacity-60 transition-opacity" : "transition-opacity"
      }
    >
      <MobileCards vehicles={vehicles} onEdit={onEdit} onDelete={onDelete} />
      <DesktopTable vehicles={vehicles} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

function Thumbnail({ vehicle, className }: { vehicle: Vehicle; className?: string }) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden rounded-lg bg-ink-100 ring-1 ring-inset ring-ink-200 ${className}`}
    >
      <Image
        src={vehicle.photo}
        alt=""
        fill
        sizes="96px"
        className="object-cover"
      />
    </span>
  );
}

function ActionButtons({
  vehicle,
  onEdit,
  onDelete,
}: Omit<VehicleListProps, "vehicles" | "busy"> & { vehicle: Vehicle }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onEdit(vehicle)}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
      >
        <Pencil className="size-4" aria-hidden="true" />
        Ubah
        <span className="sr-only"> {vehicle.name}</span>
      </button>

      <button
        type="button"
        onClick={() => onDelete(vehicle)}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-600 transition-colors hover:bg-danger-50 hover:text-danger-700"
      >
        <Trash2 className="size-4" aria-hidden="true" />
        <span className="sr-only">Hapus {vehicle.name}</span>
        <span aria-hidden="true">Hapus</span>
      </button>
    </div>
  );
}

function MobileCards({ vehicles, onEdit, onDelete }: Omit<VehicleListProps, "busy">) {
  return (
    <ul className="flex flex-col gap-3 md:hidden">
      {vehicles.map((vehicle) => (
        <li
          key={vehicle.id}
          className="rounded-[var(--radius-card)] border border-ink-200 bg-white p-4 shadow-soft"
        >
          <div className="flex items-start gap-3">
            <Thumbnail vehicle={vehicle} className="aspect-16/10 w-24" />

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink-900">{vehicle.name}</p>
              <p className="mt-0.5 truncate font-mono text-xs text-ink-500">{vehicle.id}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge tone="brand">{tierLabels[vehicle.tier]}</Badge>
                <Badge>{accentLabels[vehicle.accent]}</Badge>
              </div>
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-ink-100 pt-3 text-sm">
            <div className="flex items-center gap-1.5 text-ink-600">
              <Users className="size-4 shrink-0 text-ink-400" aria-hidden="true" />
              <dt className="sr-only">Kursi</dt>
              <dd>{vehicle.seats} kursi</dd>
            </div>
            <div className="flex items-center gap-1.5 text-ink-600">
              <Briefcase className="size-4 shrink-0 text-ink-400" aria-hidden="true" />
              <dt className="sr-only">Bagasi</dt>
              <dd>{vehicle.luggage} koper</dd>
            </div>
            <div className="flex items-center gap-1.5 text-ink-600">
              <BatteryCharging className="size-4 shrink-0 text-ink-400" aria-hidden="true" />
              <dt className="sr-only">Jarak tempuh</dt>
              <dd>{vehicle.rangeKm} km</dd>
            </div>
          </dl>

          <div className="mt-3 flex items-end justify-between gap-3 border-t border-ink-100 pt-3">
            <div>
              <p className="text-sm font-bold text-ink-900">{formatIDR(vehicle.dailyRate)}</p>
              <p className="text-xs text-ink-500">
                harian · antar-jemput {formatIDR(vehicle.transferRate)}
              </p>
            </div>
            <ActionButtons vehicle={vehicle} onEdit={onEdit} onDelete={onDelete} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function DesktopTable({ vehicles, onEdit, onDelete }: Omit<VehicleListProps, "busy">) {
  return (
    <div className="hidden overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-white shadow-soft md:block">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">Daftar armada</caption>
        <thead>
          <tr className="border-b border-ink-200 bg-ink-50 text-xs uppercase tracking-wider text-ink-500">
            <th scope="col" className="px-4 py-3 font-semibold">Unit</th>
            <th scope="col" className="px-4 py-3 font-semibold">Kelas</th>
            <th scope="col" className="px-4 py-3 font-semibold">Kapasitas</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">Tarif harian</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">Antar-jemput</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr
              key={vehicle.id}
              className="border-b border-ink-100 transition-colors last:border-0 hover:bg-ink-50/60"
            >
              <th scope="row" className="px-4 py-3 font-normal">
                <div className="flex items-center gap-3">
                  <Thumbnail vehicle={vehicle} className="aspect-16/10 w-16" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink-900">{vehicle.name}</p>
                    <p className="truncate font-mono text-xs text-ink-500">{vehicle.id}</p>
                  </div>
                </div>
              </th>

              <td className="px-4 py-3">
                <div className="flex flex-col items-start gap-1">
                  <Badge tone="brand">{tierLabels[vehicle.tier]}</Badge>
                  <span className="text-xs text-ink-500">{accentLabels[vehicle.accent]}</span>
                </div>
              </td>

              <td className="px-4 py-3 text-ink-600">
                <span className="whitespace-nowrap">{vehicle.seats} kursi</span>
                <span className="text-ink-300"> · </span>
                <span className="whitespace-nowrap">{vehicle.luggage} koper</span>
                <p className="text-xs text-ink-500">{vehicle.rangeKm} km</p>
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-ink-900">
                {formatIDR(vehicle.dailyRate)}
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-right text-ink-600">
                {formatIDR(vehicle.transferRate)}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <ActionButtons vehicle={vehicle} onEdit={onEdit} onDelete={onDelete} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
