import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getUpcomingEvents } from '@/lib/content-data'

export async function EventsStrip() {
  const events = await getUpcomingEvents(8)

  return (
    <section className="spacing-fluid-lg bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-4xl text-foreground sm:text-5xl">
              Upcoming <span className="text-primary">Nights</span>
            </h2>
            <p className="mt-2 text-muted-foreground">What&apos;s on the calendar.</p>
          </div>
          {events.length > 0 && (
            <Link
              href="/reservations"
              className="group hidden shrink-0 items-center gap-2 text-sm uppercase tracking-wide text-primary hover:text-primary/80 sm:inline-flex"
            >
              All events
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
          {events.map((event) => (
            <div key={event.id} className="glass-dark overflow-hidden rounded-2xl">
              <div className="relative aspect-[4/5]">
                {event.image_url ? (
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="h-full w-full bg-white/5" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xs uppercase tracking-wide text-primary">{event.category}</p>
                  <h3 className="font-heading mt-1 text-lg text-foreground">{event.title}</h3>
                  <p className="mt-1 text-xs text-white/60">
                    {new Date(`${event.date}T00:00`).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    · {event.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <p className="col-span-full py-6 text-center text-white/40">No upcoming events posted yet.</p>
          )}
        </div>

        {events.length > 0 && (
          <div className="mt-6 flex justify-center sm:hidden">
            <Link
              href="/reservations"
              className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur transition-colors"
            >
              All events
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
