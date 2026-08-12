"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type StepperItem = {
  id: string;
  label: string;
  hint?: string;
};

type StepperProps = {
  steps: StepperItem[];
  /** Zero-based index of the active step. */
  current: number;
  /** Called when a completed step is clicked. Omit to disable navigation. */
  onStepClick?: (index: number) => void;
  className?: string;
};

/**
 * Compact progress bar on mobile, full horizontal stepper from `sm` upward.
 * Only already-completed steps are clickable — jumping ahead would skip
 * validation.
 */
export function Stepper({ steps, current, onStepClick, className }: StepperProps) {
  const total = steps.length;
  const progress = ((current + 1) / total) * 100;

  return (
    <div className={cn("w-full", className)}>
      {/* Mobile */}
      <div className="sm:hidden">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-semibold text-ink-900">{steps[current]?.label}</p>
          <p className="shrink-0 text-xs font-medium text-ink-500">
            Langkah {current + 1} dari {total}
          </p>
        </div>
        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-200"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={current + 1}
          aria-label="Progres pemesanan"
        >
          <div
            className="h-full rounded-full bg-brand-600 transition-[width] duration-400 ease-[var(--ease-out-soft)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Desktop */}
      <ol className="hidden sm:flex sm:items-center">
        {steps.map((step, index) => {
          const isComplete = index < current;
          const isCurrent = index === current;
          const isClickable = Boolean(onStepClick) && isComplete;

          return (
            <li
              key={step.id}
              className={cn("flex min-w-0 items-center", index < total - 1 && "flex-1")}
            >
              <button
                type="button"
                disabled={!isClickable}
                onClick={isClickable ? () => onStepClick?.(index) : undefined}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex min-w-0 items-center gap-3 rounded-full text-left",
                  isClickable && "cursor-pointer",
                  !isClickable && "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isComplete && "border-brand-600 bg-brand-600 text-white",
                    isCurrent && "border-brand-600 bg-white text-brand-700",
                    !isComplete && !isCurrent && "border-ink-200 bg-white text-ink-500",
                  )}
                >
                  {isComplete ? <Check className="size-4" aria-hidden="true" /> : index + 1}
                </span>

                <span className="min-w-0">
                  <span
                    className={cn(
                      "block truncate text-sm font-semibold",
                      isCurrent || isComplete ? "text-ink-900" : "text-ink-500",
                    )}
                  >
                    {step.label}
                  </span>
                  {step.hint ? (
                    <span className="block truncate text-xs text-ink-500">{step.hint}</span>
                  ) : null}
                </span>
              </button>

              {index < total - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mx-3 h-0.5 flex-1 rounded-full transition-colors lg:mx-4",
                    isComplete ? "bg-brand-600" : "bg-ink-200",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
