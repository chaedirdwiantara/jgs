import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  /** `light` renders for dark backgrounds (footer, hero). */
  tone?: "dark" | "light";
  className?: string;
};

export function Logo({ tone = "dark", className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label={`${siteConfig.brandName} — beranda`}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft transition-transform duration-200 ease-[var(--ease-out-soft)] group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <path
            d="M13.2 2 5 13.4h5.1L9.6 22 18 10.4h-5.2L13.2 2Z"
            fill="currentColor"
          />
        </svg>
      </span>

      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[15px] font-extrabold tracking-tight",
            tone === "light" ? "text-white" : "text-ink-900",
          )}
        >
          {siteConfig.brandName}
        </span>
        <span
          className={cn(
            "mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]",
            tone === "light" ? "text-brand-200" : "text-brand-600",
          )}
        >
          EV Rental
        </span>
      </span>
    </Link>
  );
}
