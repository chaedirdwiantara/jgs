"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { Vehicle } from "@/data/vehicles";
import { describeError } from "@/features/admin/repository";

type ConfirmDeleteDialogProps = {
  vehicle: Vehicle | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
};

export function ConfirmDeleteDialog({
  vehicle,
  onClose,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVehicleId, setLastVehicleId] = useState(vehicle?.id ?? null);

  // Drop a stale error when the dialog is pointed at a different unit, so the
  // next attempt does not open pre-failed. Adjusting state during render rather
  // than in an effect avoids the extra render pass — same approach as
  // `site-header.tsx`.
  const vehicleId = vehicle?.id ?? null;
  if (vehicleId !== lastVehicleId) {
    setLastVehicleId(vehicleId);
    setError(null);
  }

  const confirm = async () => {
    if (!vehicle) return;

    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm(vehicle.id);
      onClose();
    } catch (cause) {
      setError(describeError(cause));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      open={vehicle !== null}
      onClose={onClose}
      title="Hapus unit ini?"
      description="Unit akan hilang dari halaman armada dan tidak bisa dipilih saat pemesanan."
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isDeleting} fullWidth>
            Batal
          </Button>
          <Button
            onClick={confirm}
            disabled={isDeleting}
            fullWidth
            className="bg-danger-600 hover:bg-danger-700"
          >
            {isDeleting ? "Menghapus…" : "Hapus"}
          </Button>
        </div>
      }
    >
      <p className="text-[15px] leading-relaxed text-ink-700">
        {vehicle ? (
          <>
            Anda akan menghapus <strong className="font-semibold text-ink-900">{vehicle.name}</strong>{" "}
            (<code className="rounded bg-ink-100 px-1.5 py-0.5 text-sm">{vehicle.id}</code>).
            Tindakan ini tidak dapat dibatalkan.
          </>
        ) : null}
      </p>

      {error ? (
        <p role="alert" className="mt-4 rounded-[var(--radius-field)] bg-danger-50 p-3 text-sm text-danger-700">
          {error}
        </p>
      ) : null}
    </Modal>
  );
}
