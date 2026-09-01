import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import { TicketPurchaseForm } from '@/components/events/ticket-purchase-form'
import { getEventBySlug } from '@/lib/content-data'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: 'Event' }
  return { title: event.title, description: event.description }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) {
    notFound()
  }

  return (
    <main>
      <PageHeader eyebrow={event.category} title={event.title} description={`${event.day}, ${event.time}`} />

      <section className="px-4 pb-12 md:pb-20">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="space-y-6">
            {event.image_url && (
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border">
                <Image src={event.image_url} alt={event.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
              </div>
            )}
            {event.artist && <p className="text-lg text-primary">{event.artist}</p>}
            <p className="leading-relaxed text-muted-foreground">{event.description}</p>
          </div>

          <TicketPurchaseForm event={event} />
        </div>
      </section>
    </main>
  )
}
