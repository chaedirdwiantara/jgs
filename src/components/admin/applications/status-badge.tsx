import { statusLabels, type ApplicationStatus } from "@/features/admin/types";
import { cn } from "@/lib/utils";

/**
 * Colour is never the only signal — the label is always spelled out, so the
 * status reads the same to someone who cannot separate the two reds.
 */
const tones: Record<ApplicationStatus, string> = {
  baru: "bg-brand-50 text-brand-700 ring-brand-200",
  diproses: "bg-amber-50 text-amber-800 ring-amber-200",
  disetujui: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  ditolak: "bg-ink-100 text-ink-600 ring-ink-300",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        tones[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
