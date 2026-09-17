"use client";

import { AlertTriangle, Car, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";

import { AdminConsoleSkeleton } from "@/components/admin/admin-console-skeleton";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { LocalModeBanner } from "@/components/admin/local-mode-banner";
import { AdminPageHeader } from "@/components/admin/page-header";
import { VehicleFormDialog } from "@/components/admin/vehicle-form-dialog";
import { VehicleList } from "@/components/admin/vehicle-list";
import { Button } from "@/components/ui/button";
import type { Vehicle } from "@/data/vehicles";
import { useAdminSession } from "@/features/admin/hooks/use-admin-session";
import { useVehicles } from "@/features/admin/hooks/use-vehicles";

/** `null` = closed, `"new"` = create, a vehicle = edit. */
type FormTarget = null | "new" | Vehicle;

/**
 * Fleet management. The sign-in gate and the page chrome live in `AdminShell`,
 * so this screen only has to render the fleet.
 */
export function AdminConsole() {
  const { isAuthenticated } = useAdminSession();
  const { vehicles, status, error, isFetching, isMutating, refresh, save, remove } =
    useVehicles(isAuthenticated);

  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [pendingDelete, setPendingDelete] = useState<Vehicle | null>(null);

  return (
    <div>
      <AdminPageHeader
        title="Manajemen Armada"
        description={
          status === "ready"
            ? `${vehicles.length} unit terdaftar. Data ini yang tampil di halaman armada dan alur pemesanan.`
            : "Kelola data mobil yang tampil di situs."
        }
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => void refresh()}
              disabled={isFetching || status === "loading" || isMutating}
            >
              <RefreshCw
                className={`size-4 ${isFetching || status === "loading" ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              Muat ulang
            </Button>

            <Button onClick={() => setFormTarget("new")} disabled={isMutating}>
              <Plus className="size-4" aria-hidden="true" />
              Tambah Mobil
            </Button>
          </>
        }
      />

      <LocalModeBanner />

      <div className="mt-6">
        {status === "loading" ? <AdminConsoleSkeleton /> : null}

        {status === "error" ? (
          <ErrorState message={error} onRetry={() => void refresh()} />
        ) : null}

        {status === "ready" && vehicles.length === 0 ? (
          <EmptyState onCreate={() => setFormTarget("new")} />
        ) : null}

        {status === "ready" && vehicles.length > 0 ? (
          <VehicleList
            vehicles={vehicles}
            busy={isMutating}
            onEdit={(vehicle) => setFormTarget(vehicle)}
            onDelete={(vehicle) => setPendingDelete(vehicle)}
          />
        ) : null}
      </div>

      <VehicleFormDialog
        open={formTarget !== null}
        vehicle={formTarget === "new" ? null : formTarget}
        onClose={() => setFormTarget(null)}
        onSubmit={save}
      />

      <ConfirmDeleteDialog
        vehicle={pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={remove}
      />
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-danger-200 bg-white p-10 text-center shadow-soft"
    >
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-danger-50 text-danger-600">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </span>
      <div>
        <p className="font-semibold text-ink-900">Gagal memuat data armada</p>
        <p className="mt-1 text-sm text-ink-600">{message ?? "Terjadi kesalahan."}</p>
      </div>
      <Button variant="secondary" onClick={onRetry}>
        <RefreshCw className="size-4" aria-hidden="true" />
        Coba lagi
      </Button>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-dashed border-ink-300 bg-white p-10 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-ink-100 text-ink-500">
        <Car className="size-6" aria-hidden="true" />
      </span>
      <div>
        <p className="font-semibold text-ink-900">Belum ada unit terdaftar</p>
        <p className="mt-1 text-sm text-ink-600">
          Tambahkan mobil pertama agar halaman armada tidak kosong.
        </p>
      </div>
      <Button onClick={onCreate}>
        <Plus className="size-4" aria-hidden="true" />
        Tambah Mobil
      </Button>
    </div>
  );
}
