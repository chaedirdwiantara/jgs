import type { ComponentPropsWithRef } from "react";

import { cn } from "@/lib/utils";

import { controlClasses, controlErrorClasses } from "./field";

type InputProps = ComponentPropsWithRef<"input"> & { invalid?: boolean };

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      className={cn(controlClasses, invalid && controlErrorClasses, className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

type TextareaProps = ComponentPropsWithRef<"textarea"> & { invalid?: boolean };

export function Textarea({ className, invalid, rows = 3, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(controlClasses, "resize-y", invalid && controlErrorClasses, className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

type SelectProps = ComponentPropsWithRef<"select"> & { invalid?: boolean };

export function Select({ className, invalid, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          controlClasses,
          "appearance-none pr-10",
          invalid && controlErrorClasses,
          className,
        )}
        aria-invalid={invalid || undefined}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
