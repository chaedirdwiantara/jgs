import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-200 ease-[var(--ease-out-soft)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-soft hover:bg-brand-700 hover:shadow-lift",
  secondary:
    "bg-white text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-ink-50 hover:ring-ink-300",
  ghost: "bg-transparent text-ink-700 hover:bg-ink-100",
  whatsapp: "bg-[#1EBE5D] text-white shadow-soft hover:bg-[#17A551] hover:shadow-lift",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: Omit<CommonProps, "children">) {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

type ButtonProps = CommonProps & ComponentPropsWithoutRef<"button">;

export function Button({
  variant,
  size,
  fullWidth,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children">;

export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, fullWidth, className })} {...props}>
      {children}
    </Link>
  );
}
