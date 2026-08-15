"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Pinned below the scrollable body — put the primary action here. */
  footer?: ReactNode;
  size?: "md" | "lg";
  children: ReactNode;
};

/**
 * Dialog built on the native `<dialog>` element.
 *
 * `showModal()` gives focus trapping, Escape handling, inert background content
 * and the top-layer stacking for free — all of which a hand-rolled overlay has
 * to reimplement and usually gets subtly wrong.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = "md",
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  // Escape fires `cancel`; intercept it so closing always runs through the
  // parent's state rather than letting the DOM and React disagree.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };

    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [onClose]);

  // `showModal` makes the page inert but not unscrollable.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // The dialog fills the viewport and centres its own panel, so a click
      // anywhere outside the panel lands here and dismisses.
      onMouseDown={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className={cn(
        "m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-ink-950/60 backdrop:backdrop-blur-[2px]",
        "open:flex open:items-end open:justify-center sm:open:items-center",
      )}
    >
      <div
        className={cn(
          "animate-fade-rise flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[var(--radius-card)] bg-white shadow-lift sm:m-4 sm:rounded-[var(--radius-card)]",
          size === "lg" ? "sm:max-w-3xl" : "sm:max-w-xl",
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-ink-200 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-base font-bold text-ink-900 sm:text-lg">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1 text-sm text-ink-600">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="-mr-1 inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>

        {footer ? (
          <footer className="border-t border-ink-200 bg-ink-50 px-5 py-4 sm:px-6">
            {footer}
          </footer>
        ) : null}
      </div>
    </dialog>
  );
}
