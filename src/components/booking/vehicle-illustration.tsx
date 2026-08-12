import type { Vehicle } from "@/data/vehicles";
import { cn } from "@/lib/utils";

const accents: Record<Vehicle["accent"], { body: string; glass: string; bg: string }> = {
  mint: { body: "#34d3a1", glass: "#065b47", bg: "from-brand-50 to-brand-100" },
  teal: { body: "#12b285", glass: "#022c23", bg: "from-brand-50 to-emerald-100" },
  slate: { body: "#4d5768", glass: "#141b28", bg: "from-ink-50 to-ink-100" },
  sand: { body: "#c8a260", glass: "#3a2f1c", bg: "from-amber-50 to-amber-100" },
};

type Props = {
  vehicle: Vehicle;
  className?: string;
};

/**
 * Vector stand-in for a fleet photo.
 *
 * ⚠️ Replace with real photography when available: drop images into
 * `public/images/fleet/<vehicle-id>.webp` and swap this component for
 * `next/image`. Using a generated silhouette avoids shipping placeholder stock
 * photos that misrepresent the actual fleet.
 */
export function VehicleIllustration({ vehicle, className }: Props) {
  const accent = accents[vehicle.accent];

  return (
    <div
      className={cn(
        "relative flex aspect-16/10 w-full items-center justify-center overflow-hidden bg-linear-to-br",
        accent.bg,
        className,
      )}
    >
      <svg
        viewBox="0 0 320 160"
        className="h-full w-full"
        role="img"
        aria-label={`Ilustrasi ${vehicle.name}`}
      >
        <ellipse cx="160" cy="132" rx="120" ry="9" fill="#0a0f18" opacity="0.08" />

        {/* Body */}
        <path
          d="M42 108c-9 0-14-5-14-13 0-11 6-17 18-20l24-6 22-21c6-6 14-9 23-9h50c10 0 19 4 26 11l19 19 25 6c13 3 20 10 20 21 0 8-5 12-14 12H42Z"
          fill={accent.body}
        />
        {/* Cabin glass */}
        <path
          d="M104 68 121 51c3-3 7-5 11-5h22v22h-50Zm60-22h20c5 0 10 2 14 6l16 16h-50V46Z"
          fill={accent.glass}
          opacity="0.85"
        />
        {/* Light bar */}
        <rect x="252" y="86" width="24" height="7" rx="3.5" fill="#ffffff" opacity="0.85" />
        <rect x="44" y="86" width="20" height="7" rx="3.5" fill="#ffffff" opacity="0.5" />

        {/* Wheels */}
        <g fill="#141b28">
          <circle cx="96" cy="110" r="22" />
          <circle cx="230" cy="110" r="22" />
        </g>
        <g fill="#f7f8fa">
          <circle cx="96" cy="110" r="9" />
          <circle cx="230" cy="110" r="9" />
        </g>

        {/* Charge bolt badge */}
        <g transform="translate(150 88)">
          <circle r="13" fill="#ffffff" opacity="0.92" />
          <path d="M1.6-7-5 1.6h3.9L-1.8 7 5-1.6H1.1L1.6-7Z" fill="#058f6c" />
        </g>
      </svg>
    </div>
  );
}
