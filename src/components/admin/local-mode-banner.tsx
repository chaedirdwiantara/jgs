import { HardDrive } from "lucide-react";

import { isBackendConfigured } from "@/features/admin/config";

/**
 * Says out loud that nothing is being saved to a server yet.
 *
 * Without this the console looks identical to the connected version, and
 * someone will enter a real catalogue — or worse, work a real application —
 * into a browser profile and lose it.
 *
 * Renders nothing once `NEXT_PUBLIC_API_BASE_URL` is set, so screens can drop
 * it in unconditionally.
 */
export function LocalModeBanner() {
  if (isBackendConfigured) return null;

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
