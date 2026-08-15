import { Cta } from "@/components/home/cta";
import { Faq } from "@/components/home/faq";
import { FleetPreview } from "@/components/home/fleet-preview";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Services } from "@/components/home/services";
import { WhyUs } from "@/components/home/why-us";
import { faqItems } from "@/data/faq";
import { siteConfig } from "@/config/site";

/** FAQ rich result — plain JSON-LD, no third-party dependency. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
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
      <Faq />
      <Cta />

      <script
        type="application/ld+json"
        // Static, developer-authored payload — no user input is interpolated.
        dangerouslySetInnerHTML={{ __html: JSON.stringify([orgJsonLd, faqJsonLd]) }}
      />
    </>
  );
}
