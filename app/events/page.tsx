import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { getUpcomingEvents } from '@/lib/content-data'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming events at Cork & Thorn — live music, DJ sets, and more in Las Vegas.',
}

// See app/page.tsx for why this is needed — same static-prerender gap.
export const revalidate = 60

export default async function EventsPage() {
  const events = await getUpcomingEvents(50)

  return (
    <main>
      <PageHeader
        eyebrow="Events"
        title="What's On"
        description="Live music, DJ sets, and one-off nights at Cork & Thorn — pick a date and grab tickets."
      />

      <section className="px-4 pb-12 md:pb-20">
        <div className="mx-auto max-w-6xl">
          {events.length === 0 ? (
            <p className="text-center text-muted-foreground">No upcoming events right now — check back soon.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/70"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={event.image_url || '/placeholder.svg'}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <Badge className="absolute left-3 top-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                      {event.category}
                    </Badge>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="font-heading text-xl tracking-wide">{event.title}</h2>
                    {event.artist && <p className="mt-1 text-sm text-primary">{event.artist}</p>}
                    <div className="mt-3 flex-1 text-sm text-muted-foreground">
                      {event.day}, {event.time}
                    </div>
                    <p className="mt-3 font-heading text-lg">{event.price === 0 ? 'Free Entry' : `$${event.price}`}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
