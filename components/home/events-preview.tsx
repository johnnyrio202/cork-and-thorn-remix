import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { events } from '@/lib/data'

export function EventsPreview() {
  const upcoming = events.slice(0, 3)

  return (
    <section className="border-y border-border bg-card/40 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-secondary">
              What&apos;s On
            </p>
            <h2 className="font-heading text-4xl tracking-wide sm:text-5xl">
              This Week&apos;s <span className="neon-text-secondary">Entertainment</span>
            </h2>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/events" />}
            variant="outline"
          >
            Full Calendar
          </Button>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {upcoming.map((event, idx) => (
            <article
              key={event.id}
              className="group scroll-scale-in flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/70 hover:shadow-glow-primary"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={event.image || '/placeholder.svg'}
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
                <h3 className="font-heading text-2xl tracking-wide">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-primary">{event.artist}</p>
                <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {event.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" /> {event.day}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {event.time}
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-heading text-xl">
                    {event.price === 0 ? 'Free Entry' : `$${event.price}`}
                  </span>
                  <Button
                    nativeButton={false}
                    render={<Link href="/events" />}
                    size="sm"
                  >
                    RSVP
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
