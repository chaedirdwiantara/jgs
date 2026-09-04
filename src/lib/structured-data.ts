import type { FaqItem } from "@/data/faq";

/**
 * schema.org `FAQPage` for questions that are visible on the page.
 *
 * Only ever pass the same list the page renders: Google treats FAQ markup for
 * hidden or off-page questions as spam.
 */
export function faqPageJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
