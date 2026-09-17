"use client";

import { AlertTriangle, Pencil, Plus, RefreshCw, Trash2, UserRound } from "lucide-react";
import { useState } from "react";

import { LocalModeBanner } from "@/components/admin/local-mode-banner";
import { AdminPageHeader } from "@/components/admin/page-header";
import { UserFormDialog } from "@/components/admin/users/user-form-dialog";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useAdminSession } from "@/features/admin/hooks/use-admin-session";
import { useUsers } from "@/features/admin/hooks/use-users";
import { describeError } from "@/features/admin/repository";
import { roleLabels, type AdminUser } from "@/features/admin/types";
import { formatDateShortID } from "@/lib/format";
import { cn } from "@/lib/utils";

/** `null` = closed, `"new"` = create, a user = edit. */
type FormTarget = null | "new" | AdminUser;

export function UserManager() {
  const { isAuthenticated, user: currentUser } = useAdminSession();
  const { users, status, error, isFetching, isMutating, refresh, create, update, remove } =
    useUsers(isAuthenticated);

  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await remove(pendingDelete.id);
      setPendingDelete(null);
      setDeleteError(null);
    } catch (cause) {
      setDeleteError(describeError(cause));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Pengguna"
        description={
          status === "ready"
            ? `${users.length} akun terdaftar. Hanya Pemilik yang dapat mengelola halaman ini.`
            : "Akun yang boleh masuk ke konsol admin."
        }
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => void refresh()}
              disabled={isFetching || status === "loading" || isMutating}
            >
              <RefreshCw
                className={cn("size-4", (isFetching || status === "loading") && "animate-spin")}
                aria-hidden="true"
              />
              Muat ulang
            </Button>

            <Button onClick={() => setFormTarget("new")} disabled={isMutating}>
              <Plus className="size-4" aria-hidden="true" />
              Tambah Pengguna
            </Button>
          </>
        }
      />

      <LocalModeBanner />

      <div className="mt-6">
        {status === "loading" ? (
          <div className="flex flex-col gap-3" aria-hidden="true">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-[var(--radius-card)] border border-ink-200 bg-white"
              />
            ))}
          </div>
        ) : null}

        {status === "error" ? (
          <div
            role="alert"
            className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-danger-200 bg-white p-10 text-center shadow-soft"
          >
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-danger-50 text-danger-600">
              <AlertTriangle className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-ink-900">Gagal memuat pengguna</p>
              <p className="mt-1 text-sm text-ink-600">{error ?? "Terjadi kesalahan."}</p>
            </div>
            <Button variant="secondary" onClick={() => void refresh()}>
              <RefreshCw className="size-4" aria-hidden="true" />
              Coba lagi
            </Button>
          </div>
        ) : null}

        {status === "ready" ? (
          <ul className="flex flex-col gap-3">
            {users.map((item) => {
              const isSelf = item.id === currentUser?.id;

              return (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center gap-4 rounded-[var(--radius-card)] border border-ink-200 bg-white p-4 shadow-soft"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      item.isActive ? "bg-brand-600 text-white" : "bg-ink-200 text-ink-500",
                    )}
                  >
                    <UserRound className="size-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-semibold text-ink-900">
                        {item.name}
                      </span>
                      <span className="shrink-0 rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-600">
                        {roleLabels[item.role]}
                      </span>
                      {isSelf ? (
                        <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                          Anda
                        </span>
                      ) : null}
                      {!item.isActive ? (
                        <span className="shrink-0 rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-500">
                          Nonaktif
                        </span>
                      ) : null}
                    </p>
                    <p className="truncate text-xs text-ink-500">{item.email}</p>
                    <p className="mt-0.5 text-xs text-ink-400">
                      {item.lastLoginAt
                        ? `Terakhir masuk ${formatDateShortID(item.lastLoginAt.slice(0, 10))}`
                        : "Belum pernah masuk"}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => setFormTarget(item)}
                      disabled={isMutating}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink-700 transition-colors hover:bg-ink-100 disabled:opacity-50"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                      Ubah
                    </button>

                    {/*
                      Deleting yourself is refused by the API too; disabling it
                      here just avoids offering an action that cannot work.
                    */}
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError(null);
                        setPendingDelete(item);
                      }}
                      disabled={isMutating || isSelf}
                      title={isSelf ? "Anda tidak dapat menghapus akun sendiri" : undefined}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-danger-700 transition-colors hover:bg-danger-50 disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Hapus
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <UserFormDialog
        open={formTarget !== null}
        user={formTarget === "new" ? null : formTarget}
        onClose={() => setFormTarget(null)}
        onCreate={create}
        onUpdate={update}
      />

      <Modal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Hapus pengguna"
        description={
          pendingDelete
            ? `${pendingDelete.name} tidak akan bisa masuk lagi ke konsol.`
            : undefined
        }
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>
              Batal
            </Button>
            <Button
              onClick={() => void confirmDelete()}
              disabled={isMutating}
              className="bg-danger-600 hover:bg-danger-700"
            >
              {isMutating ? "Menghapus…" : "Hapus"}
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-ink-600">
          Riwayat tindakan yang sudah tercatat tetap tersimpan. Bila akun ini
          hanya perlu dihentikan sementara, ubah statusnya menjadi nonaktif.
        </p>

        {deleteError ? (
          <p
            role="alert"
            className="mt-4 rounded-[var(--radius-field)] bg-danger-50 p-3 text-sm text-danger-700"
          >
            {deleteError}
          </p>
        ) : null}
      </Modal>
    </div>
  );
}
