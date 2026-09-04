import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import { Container, Section, SectionHeading } from "@/components/ui/section";
import type { FaqItem } from "@/data/faq";
import { buildWhatsAppUrl } from "@/lib/contact-links";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  /** Defaults to a "still have questions?" line that links to WhatsApp. */
  description?: ReactNode;
  items: FaqItem[];
  className?: string;
};

/**
 * Heading beside an accordion of questions. Native `<details>` elements, so it
 * works without JavaScript and needs no ARIA wiring of its own.
 *
 * This is only the visible half of an FAQ — pair it with `faqPageJsonLd` on
 * the same page so the structured data never lists a question visitors
 * cannot actually read there.
 */
export function FaqSection({
  eyebrow = "FAQ",
  title,
  description = <WhatsAppHint />,
  items,
  className,
}: Props) {
  return (
    <Section className={cn("bg-white", className)}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          </div>

          <div className="lg:col-span-8">
            <div className="divide-y divide-ink-200 border-y border-ink-200">
              {items.map((item) => (
                <details key={item.question} className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-[15px] font-semibold text-ink-900 transition-colors hover:text-brand-700">
                    {item.question}
                    <ChevronDown
                      className="mt-0.5 size-5 shrink-0 text-ink-400 transition-transform duration-200 group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="pb-5 pr-9 text-sm leading-relaxed text-ink-600">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function WhatsAppHint() {
  return (
    <>
      Belum menemukan jawabannya? Tim kami siap membantu melalui{" "}
      <a
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-brand-600 underline underline-offset-4 hover:text-brand-700"
      >
        WhatsApp
      </a>
      .
    </>
  );
}
