import { CalendarDays, CalendarRange, PencilLine, User } from "lucide-react";

import type { BookingDetails } from "@/features/booking/types";
import { formatDateShortID } from "@/lib/format";

type Props = {
  details: BookingDetails;
  onEdit?: () => void;
};

/**
 * Slim recap of step 1, shown above the fleet grid so the user can verify
 * their inputs without navigating back.
 */
export function BookingRecap({ details, onEdit }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[var(--radius-card)] border border-ink-200 bg-ink-50 p-4">
      <RecapItem icon={<CalendarDays className="size-4" />} label="Mulai">
        {formatDateShortID(details.startDate) || "—"}
      </RecapItem>

      <RecapItem icon={<CalendarRange className="size-4" />} label="Durasi">
        {details.durationDays} hari
      </RecapItem>

      <RecapItem icon={<User className="size-4" />} label="Pemesan">
        {details.fullName || "—"}
      </RecapItem>

      {onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
        >
          <PencilLine className="size-4" aria-hidden="true" />
          Ubah
        </button>
      ) : null}
    </div>
  );
}

function RecapItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-ink-400" aria-hidden="true">
        {icon}
      </span>
      <span className="text-ink-500">{label}:</span>
      <span className="font-semibold text-ink-900">{children}</span>
    </div>
  );
}
