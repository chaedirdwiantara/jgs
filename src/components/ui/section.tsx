import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Section({
  className,
  ...props
}: ComponentPropsWithoutRef<"section">) {
  return <section className={cn("py-16 sm:py-20 lg:py-24", className)} {...props} />;
}

export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("container-page", className)} {...props} />;
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="text-balance text-2xl font-bold leading-tight tracking-tight text-ink-900 sm:text-3xl lg:text-4xl">
        {title}
      </h2>

      {description ? (
        <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink-600 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
