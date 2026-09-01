import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { JobApplicationForm } from '@/components/jobs/job-application-form'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join the Cork & Thorn team in Las Vegas — bartending, service, kitchen, and event roles.',
}

export default function JobsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Careers"
        title="Join the Team"
        description="We're always looking for people who care about hospitality as much as we do. Apply below and our hiring team will be in touch."
      />

      <section className="px-4 pb-12 md:pb-20">
        <div className="mx-auto max-w-2xl">
          <JobApplicationForm />
        </div>
      </section>
    </main>
  )
}
