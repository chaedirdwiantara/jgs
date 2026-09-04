import type { Metadata } from "next";

import { FaqSection } from "@/components/faq/faq-section";
import { Cta } from "@/components/home/cta";
import { FleetPreview } from "@/components/home/fleet-preview";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Services } from "@/components/home/services";
import { WhyUs } from "@/components/home/why-us";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { homeFaqItems } from "@/data/faq";
import { faqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  /*
   * Self-referencing canonical. Every other page declares one next to its
   * title; the home page inherits the root title, so this is its only
   * page-level metadata. It also folds the `*.pages.dev` preview host into
   * the production domain for search engines.
   */
  alternates: { canonical: "/" },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRental",
  name: siteConfig.productName,
  legalName: siteConfig.legalName,
  url: siteConfig.url,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.contact.address,
    addressCountry: "ID",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <HowItWorks />
      <FleetPreview />
      <WhyUs />
      <FaqSection title="Pertanyaan yang sering diajukan" items={homeFaqItems} />
      <Cta />

      <JsonLd data={[orgJsonLd, faqPageJsonLd(homeFaqItems)]} />
    </>
  );
}
