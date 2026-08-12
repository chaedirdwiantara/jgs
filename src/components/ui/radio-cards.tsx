"use client";

import type { ComponentPropsWithRef } from "react";

import { cn } from "@/lib/utils";

export type RadioCardOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

type RadioCardsProps<T extends string> = {
  name: string;
  legend: string;
  options: RadioCardOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** 1 column on mobile; this controls the desktop track count. */
  columns?: 2 | 3;
  className?: string;
};

/**
 * Segmented radio group rendered as tappable cards — a larger hit target than
 * native radios, which matters most on mobile.
 */
export function RadioCards<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  columns = 2,
  className,
}: RadioCardsProps<T>) {
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="mb-2 text-sm font-medium text-ink-800">{legend}</legend>
      <div
        className={cn(
          "grid gap-2.5",
          columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3",
        )}
      >
        {options.map((option) => {
          const checked = option.value === value;
          const id = `${name}-${option.value}`;

          return (
            <label
              key={option.value}
              htmlFor={id}
              className={cn(
                "relative flex cursor-pointer items-start gap-3 rounded-[var(--radius-field)] border p-3.5 transition-colors",
                "has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-500/20",
                checked
                  ? "border-brand-500 bg-brand-50"
                  : "border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50",
              )}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />

              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  checked ? "border-brand-600" : "border-ink-300",
                )}
              >
                <span
                  className={cn(
                    "size-2.5 rounded-full transition-transform",
                    checked ? "scale-100 bg-brand-600" : "scale-0 bg-transparent",
                  )}
                />
              </span>

              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink-900">
                  {option.label}
                </span>
                {option.description ? (
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                    {option.description}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Plain hidden input used to keep a radio group value in the form payload. */
export function HiddenInput(props: ComponentPropsWithRef<"input">) {
  return <input type="hidden" {...props} />;
}
