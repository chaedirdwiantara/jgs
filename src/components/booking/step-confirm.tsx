"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Info, RotateCcw, ShieldCheck } from "lucide-react";

import { FleetPhoto } from "@/components/fleet/fleet-photo";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { tierLabels, type Vehicle } from "@/data/vehicles";
import { formatDuration } from "@/features/booking/constants";
import { estimatePrice } from "@/features/booking/pricing";
import type { BookingDetails } from "@/features/booking/types";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  createBookingReference,
} from "@/features/booking/whatsapp";
import { formatDateID, formatIDR } from "@/lib/format";

type Props = {
  details: BookingDetails;
  vehicle: Vehicle;
  onBack: () => void;
  onReset: () => void;
};

export function StepConfirm({ details, vehicle, onBack, onReset }: Props) {
  // Stable for the lifetime of this step so the on-screen code matches the one
  // sent to WhatsApp.
  const [reference] = useState(createBookingReference);

  const estimate = useMemo(() => estimatePrice(details, vehicle), [details, vehicle]);

  const whatsappUrl = useMemo(
    () =>
      buildWhatsAppUrl(
        buildWhatsAppMessage({
          booking: { ...details, vehicleId: vehicle.id },
          vehicle,
          reference,
        }),
      ),
    [details, vehicle, reference],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] border border-brand-200 bg-brand-50 p-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-5 shrink-0 text-brand-700" aria-hidden="true" />
          <p className="text-sm text-brand-900">
            Pesanan siap dikirim. Nomor referensi{" "}
            <span className="font-bold">{reference}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Details */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-white shadow-soft">
            <div className="flex items-center gap-4 border-b border-ink-100 p-4">
              <span className="aspect-16/10 w-24 shrink-0 overflow-hidden rounded-xl bg-ink-100 sm:w-32">
                <FleetPhoto
                  photos={vehicle.photos.studio}
                  alt={`Foto ${vehicle.name}`}
                />
              </span>
              <div className="min-w-0">
                <Badge tone="brand">{tierLabels[vehicle.tier]}</Badge>
                <h2 className="mt-1.5 truncate text-base font-bold text-ink-900">
                  {vehicle.name}
                </h2>
                <p className="text-sm text-ink-500">
                  {vehicle.seats} kursi · {vehicle.luggage} bagasi · ±{vehicle.rangeKm} km
                </p>
              </div>
            </div>

            <dl className="divide-y divide-ink-100">
              {/* Was hard-coded "Rental Harian", which contradicted the row below
                  as soon as the monthly package existed. */}
              <Row label="Layanan">
                {details.rentalPackage === "bulanan"
                  ? "Rental Bulanan"
                  : "Rental Harian"}
              </Row>
              <Row label="Tipe Pelanggan">
                {details.customerType === "perusahaan" ? "Perusahaan" : "Perorangan"}
              </Row>
              <Row label="Nama">{details.fullName}</Row>
              {details.customerType === "perusahaan" && details.companyName ? (
                <Row label="Perusahaan">{details.companyName}</Row>
              ) : null}
              <Row label="WhatsApp">{details.whatsapp}</Row>
              <Row label="Tanggal Mulai">{formatDateID(details.startDate)}</Row>
              <Row label="Paket">{details.rentalPackage === "bulanan" ? "Bulanan" : "Harian"}</Row>
              <Row label="Durasi">{formatDuration(details.rentalPackage, details.duration)}</Row>

              {details.notes ? <Row label="Catatan">{details.notes}</Row> : null}
            </dl>
          </div>
        </div>

        {/* Price */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-[var(--radius-card)] border border-ink-200 bg-white p-5 shadow-soft">
            <h2 className="text-base font-bold text-ink-900">Estimasi Biaya</h2>

            <dl className="mt-4 space-y-3">
              {estimate.lines.map((line) => (
                <div key={line.label} className="flex items-start justify-between gap-4">
                  <dt className="min-w-0 text-sm text-ink-600">
                    {line.label}
                    {line.detail ? (
                      <span className="block text-xs text-ink-500">{line.detail}</span>
                    ) : null}
                  </dt>
                  <dd
                    className={`shrink-0 text-sm font-semibold ${
                      line.amount < 0 ? "text-brand-700" : "text-ink-900"
                    }`}
                  >
                    {formatIDR(line.amount)}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-ink-200 pt-4">
              <span className="text-sm font-semibold text-ink-700">Total estimasi</span>
              <span className="text-xl font-extrabold tracking-tight text-ink-900">
                {formatIDR(estimate.total)}
              </span>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-[var(--radius-field)] bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p>
                Angka di atas adalah estimasi. Harga final, ketersediaan unit, dan
                titik serah terima dikonfirmasi oleh admin melalui WhatsApp.
              </p>
            </div>

            {/* Desktop action; the mobile action lives in the sticky bar below. */}
            <ButtonLink
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="lg"
              fullWidth
              className="mt-5 hidden lg:inline-flex"
            >
              <WhatsAppIcon />
              Pesan via WhatsApp
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button variant="secondary" onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Ganti armada
        </Button>
        <Button variant="ghost" onClick={onReset} className="w-full sm:w-auto">
          <RotateCcw className="size-4" aria-hidden="true" />
          Mulai ulang
        </Button>
      </div>

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgb(20_27_40/0.18)] lg:hidden">
        <div className="container-page flex items-center gap-3 px-0!">
          <div className="min-w-0">
            <p className="text-xs text-ink-500">Total estimasi</p>
            <p className="truncate text-base font-extrabold text-ink-900">
              {formatIDR(estimate.total)}
            </p>
          </div>
          <ButtonLink
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
            className="ml-auto flex-1 justify-center"
          >
            <WhatsAppIcon />
            Pesan
          </ButtonLink>
        </div>
      </div>
      {/* Spacer so the sticky bar never covers content. */}
      <div aria-hidden="true" className="h-28 lg:hidden" />
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="w-44 shrink-0 text-sm text-ink-500">{label}</dt>
      <dd className="min-w-0 text-sm font-medium break-words text-ink-900">{children}</dd>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm4.52 11.97c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.63 4.18 3.69.58.25 1.04.4 1.4.51.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}
