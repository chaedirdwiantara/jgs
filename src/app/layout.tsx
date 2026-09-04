import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

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
    "sewa mobil listrik Jabodetabek",
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
  verification: { google: siteConfig.google.siteVerification },
};

export const viewport: Viewport = {
  /** `--color-brand-600`. Keep in sync with `globals.css`. */
  themeColor: "#d90000",
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
      {/*
       * Deliberately bare: the marketing header/footer live in
       * `components/layout/site-chrome.tsx` and are applied by the `(site)`
       * route group, so `/admin` can share the fonts and reset without
       * inheriting a public-site shell it has no use for.
       */}
      <body className="flex min-h-dvh flex-col bg-white antialiased">{children}</body>
    </html>
  );
}
