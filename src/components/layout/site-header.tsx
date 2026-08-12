"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, Phone, X } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";
import { mainNav, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Matches the `lg` breakpoint at which the drawer is replaced by inline nav. */
const DESKTOP_QUERY = "(min-width: 64rem)";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  const drawerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Close the drawer on navigation. Adjusting state during render (rather than
  // in an effect) avoids a cascading re-render.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /**
   * Close when the viewport grows past `lg`. Without this, rotating a tablet
   * while the drawer is open hides both the drawer and its toggle but leaves
   * `overflow: hidden` on the body — the page becomes unscrollable with no
   * visible way to recover.
   */
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryList | MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Escape to close, Tab cycles inside the drawer, focus returns to toggle. */
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    drawer?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !drawer) return;

      const items = Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !drawer.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200",
        scrolled
          ? "border-ink-200 bg-white/85 backdrop-blur-md"
          : "border-transparent bg-white",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-18">
        <Logo />

        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
          >
            <Phone className="size-4" aria-hidden="true" />
            {siteConfig.contact.phone}
          </a>
          <ButtonLink href="/sewa-mobil" size="sm">
            Pesan Sekarang
          </ButtonLink>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ButtonLink href="/sewa-mobil" size="sm" className="hidden sm:inline-flex">
            Pesan
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="inline-flex size-10 items-center justify-center rounded-xl text-ink-700 transition-colors hover:bg-ink-100"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div id="mobile-nav" hidden={!open} className="lg:hidden">
        <div
          className="fixed inset-0 top-16 z-40 bg-ink-950/40"
          onClick={close}
          aria-hidden="true"
        />
        <nav
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          className="animate-fade-rise relative z-50 border-t border-ink-200 bg-white px-5 pb-6 pt-4 shadow-lift"
        >
          <ul className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "flex items-center rounded-xl px-4 py-3 text-[15px] font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-700 hover:bg-ink-100",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-2">
            <ButtonLink href="/sewa-mobil" size="lg" fullWidth>
              Pesan Sekarang
            </ButtonLink>
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100"
            >
              <Phone className="size-4" aria-hidden="true" />
              {siteConfig.contact.phone}
            </a>
            <button
              type="button"
              onClick={() => {
                close();
                toggleRef.current?.focus();
              }}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800"
            >
              Tutup menu
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
