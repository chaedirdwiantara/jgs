import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { siteConfig } from "@/config/site";

import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.productName} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.productName,
  keywords: [
    "sewa mobil listrik",
    "rental mobil listrik",
    "rental EV",
    "antar jemput bandara",
    "mobil listrik Jakarta",
    siteConfig.legalName,
  ],
  authors: [{ name: siteConfig.legalName }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    siteName: siteConfig.productName,
    title: `${siteConfig.productName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.productName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#04785a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /*
     * `data-scroll-behavior="smooth"` opts back into Next.js overriding the
     * global `scroll-behavior: smooth` during route transitions, so navigation
     * still jumps to the top instantly (Next.js 16 stopped doing this by
     * default) while in-page anchors keep smooth scrolling.
     */
    <html lang="id" className={jakarta.variable} data-scroll-behavior="smooth">
      <body className="flex min-h-dvh flex-col bg-white antialiased">
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Lompat ke konten utama
        </a>

        <SiteHeader />
        <main id="konten" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <WhatsAppFab />
      </body>
    </html>
  );
}
