'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const FAQS = [
  {
    question: 'Is there a cover charge?',
    answer:
      'Cover varies by night and event — most weeknights are free, weekend headline nights may carry a cover after a certain hour. Check the event listing for specifics.',
  },
  {
    question: 'What is the dress code?',
    answer: 'Upscale casual. No athletic wear, no flip-flops. We reserve the right to refuse entry.',
  },
  {
    question: 'Do you take reservations for booths and tables?',
    answer: 'Yes — reserve a booth or table through our reservations page. A deposit may be required for weekend nights.',
  },
  {
    question: 'What is the minimum age?',
    answer: 'Cork and Thorn is 21+ after 9PM. Valid government-issued photo ID is required at the door.',
  },
]

export function FaqSection() {
  return (
    <section className="spacing-fluid-lg bg-background">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-heading mb-2 text-4xl text-foreground sm:text-5xl">
          Good to <span className="text-primary">know</span>
        </h2>
        <p className="mb-10 text-muted-foreground">Quick answers before you come through.</p>

        <Accordion>
          {FAQS.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question} className="border-white/10">
              <AccordionTrigger className="font-heading text-base text-foreground sm:text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-white/60">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
