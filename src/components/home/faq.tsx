import { ChevronDown } from "lucide-react";

import { Container, Section, SectionHeading } from "@/components/ui/section";
import { faqItems } from "@/data/faq";

export function Faq() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="FAQ"
              title="Pertanyaan yang sering diajukan"
              description="Belum menemukan jawabannya? Tim kami siap membantu melalui WhatsApp."
            />
          </div>

          <div className="lg:col-span-8">
            <div className="divide-y divide-ink-200 border-y border-ink-200">
              {faqItems.map((item) => (
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
