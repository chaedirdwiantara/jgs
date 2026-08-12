import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-ink-200 bg-white shadow-soft",
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("p-5 sm:p-6", className)} {...props} />;
}

type BadgeProps = {
  children: ReactNode;
  tone?: "brand" | "neutral" | "amber";
  className?: string;
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  const tones = {
    brand: "bg-brand-50 text-brand-700 ring-brand-200",
    neutral: "bg-ink-100 text-ink-600 ring-ink-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
