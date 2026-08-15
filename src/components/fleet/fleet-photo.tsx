import type { FleetPhotoPair } from "@/data/vehicles";
import { cn } from "@/lib/utils";

/** Matches Tailwind's `sm` breakpoint, where every frame turns landscape. */
const WIDE_FROM = "(min-width: 40rem)";

type FleetPhotoProps = {
  photos: FleetPhotoPair;
  alt: string;
  /** Skips lazy-loading. Set only for the one photo above the fold. */
  priority?: boolean;
  className?: string;
};

/**
 * Art-directed fleet photograph.
 *
 * The two masters are not crops of each other: `tall` is the same shot on a
 * portrait canvas with a blurred fill, so it belongs in phone-shaped frames and
 * `wide` in landscape ones. That is a source swap at a breakpoint, which is
 * what `<picture>` exists for — `next/image` only varies resolution, not
 * artwork, and would need both frames to share an aspect ratio.
 *
 * Sizing is left to the parent: this fills whatever box it is given, so callers
 * own the aspect ratio at each breakpoint.
 */
export function FleetPhoto({ photos, alt, priority = false, className }: FleetPhotoProps) {
  return (
    <picture>
      <source media={WIDE_FROM} srcSet={photos.wide} />
      <img
        src={photos.tall}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={cn("size-full object-cover", className)}
      />
    </picture>
  );
}
