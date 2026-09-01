import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { ContactForm } from '@/components/contact/contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Cork & Thorn.',
}

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Contact"
        title="We'd Love to Hear From You"
        description="Questions about reservations, private events, or anything else — send us a message and we'll respond shortly."
      />

      <section className="px-4 pb-12 md:pb-20">
        <div className="mx-auto max-w-2xl">
          <ContactForm />
        </div>
      </section>
    </main>
  )
}
