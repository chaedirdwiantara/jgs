"use client";

import { AlertTriangle, Car, HardDrive, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";

import { AdminConsoleSkeleton } from "@/components/admin/admin-console-skeleton";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { LoginForm } from "@/components/admin/login-form";
import { VehicleFormDialog } from "@/components/admin/vehicle-form-dialog";
import { VehicleList } from "@/components/admin/vehicle-list";
import { Button } from "@/components/ui/button";
import type { Vehicle } from "@/data/vehicles";
import { isBackendConfigured } from "@/features/admin/config";
import { useAdminSession } from "@/features/admin/hooks/use-admin-session";
import { useVehicles } from "@/features/admin/hooks/use-vehicles";

/** `null` = closed, `"new"` = create, a vehicle = edit. */
type FormTarget = null | "new" | Vehicle;

export function AdminConsole() {
  const { isAuthenticated, requiresLogin } = useAdminSession();
  const { vehicles, status, error, isFetching, isMutating, refresh, save, remove } =
    useVehicles(isAuthenticated);

  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [pendingDelete, setPendingDelete] = useState<Vehicle | null>(null);

  if (requiresLogin && !isAuthenticated) return <LoginForm />;

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
            Manajemen Armada
          </h1>
          <p className="mt-1.5 text-sm text-ink-600">
            {status === "ready"
              ? `${vehicles.length} unit terdaftar. Data ini yang tampil di halaman armada dan alur pemesanan.`
              : "Kelola data mobil yang tampil di situs."}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
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
        </div>
      </div>

      {isBackendConfigured ? null : <LocalModeBanner />}

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

/**
 * Says out loud that nothing is being saved to a server yet. Without this the
 * admin looks identical to the connected version, and someone will enter a real
 * catalogue into a browser profile and lose it.
 */
function LocalModeBanner() {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-[var(--radius-card)] border border-amber-200 bg-amber-50 p-4">
      <HardDrive className="mt-0.5 size-5 shrink-0 text-amber-700" aria-hidden="true" />
      <div className="text-sm leading-relaxed text-amber-900">
        <p className="font-semibold">Mode lokal — belum terhubung ke server</p>
        <p className="mt-1 text-amber-800">
          Perubahan hanya tersimpan di browser ini dan tidak memengaruhi situs
          publik. Setelah API di AWS siap, isi{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">
            NEXT_PUBLIC_API_BASE_URL
          </code>{" "}
          lalu build ulang untuk beralih ke data server.
        </p>
      </div>
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
