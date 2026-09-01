import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { CateringInquiryForm } from '@/components/catering/catering-inquiry-form'

export const metadata: Metadata = {
  title: 'Catering',
  description:
    'Cork & Thorn catering for your next event — small bites, full spreads, and custom menus, delivered or on-site in Las Vegas.',
}

export default function CateringPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Catering"
        title="Bring the Menu to You"
        description="From office lunches to full-scale events, our kitchen builds custom catering packages around your guest count and occasion."
      />

      <section className="px-4 pb-12 md:pb-20">
        <div className="mx-auto max-w-2xl">
          <CateringInquiryForm />
        </div>
      </section>
    </main>
  )
}
