import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FieldProps = {
  /** Must match the `id` of the control it wraps. */
  htmlFor?: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Label + control + hint/error, wired for screen readers.
 * Controls should set `aria-describedby={`${id}-hint`}` / `${id}-error`.
 */
export function Field({
  htmlFor,
  label,
  hint,
  error,
  optional,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-baseline gap-1.5 text-sm font-medium text-ink-800"
      >
        {label}
        {optional ? (
          <span className="text-xs font-normal text-ink-500">(opsional)</span>
        ) : null}
      </label>

      {children}

      {error ? (
        <p
          id={htmlFor ? `${htmlFor}-error` : undefined}
          className="flex items-start gap-1.5 text-xs text-danger-600"
        >
          {/*
           * The icon — not the colour — is what makes this unambiguously an
           * error, since the brand palette is itself red (WCAG 1.4.1).
           */}
          <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={htmlFor ? `${htmlFor}-hint` : undefined} className="text-xs text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Shared control chrome so input/select/textarea look identical. */
export const controlClasses =
  "w-full rounded-[var(--radius-field)] border border-ink-200 bg-white px-3.5 py-2.5 text-[15px] text-ink-900 shadow-xs transition-colors placeholder:text-ink-500 hover:border-ink-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:cursor-not-allowed disabled:bg-ink-50";

/**
 * `danger-500` rather than a lighter tint: a 400-weight border only reaches
 * 2.66:1 on white, below the 3:1 WCAG minimum for non-text indicators.
 */
export const controlErrorClasses =
  "border-danger-500 focus:border-danger-600 focus:ring-danger-500/15";
