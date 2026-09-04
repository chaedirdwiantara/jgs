import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { footerNav, siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/contact-links";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-800 bg-ink-950 text-ink-300">
      <div className="container-page py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo tone="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">
              {siteConfig.description}
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                <span>{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                <span>{siteConfig.contact.operationalHours}</span>
              </li>
            </ul>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title} className="lg:col-span-2">
              <h2 className="text-sm font-semibold text-white">{group.title}</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {group.items.map((item) => (
                  <li key={`${group.title}-${item.label}`}>
                    <Link
                      href={item.href}
                      className="text-ink-400 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-3">
            <h2 className="text-sm font-semibold text-white">Hubungi Kami</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-ink-400 transition-colors hover:text-white"
                >
                  <MessageCircle className="size-4 shrink-0 text-brand-400" aria-hidden="true" />
                  <span className="sr-only">WhatsApp </span>
                  {siteConfig.contact.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="inline-flex items-center gap-2 break-all text-ink-400 transition-colors hover:text-white"
                >
                  <Mail className="size-4 shrink-0 text-brand-400" aria-hidden="true" />
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink-800 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}. Seluruh hak cipta dilindungi.
          </p>
          <p>Armada 100% kendaraan listrik.</p>
        </div>
      </div>
    </footer>
  );
}
