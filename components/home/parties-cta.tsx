import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function PartiesCta() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-07-10%20at%203.08.48%E2%80%AFAM.png-xMpNaQE7LoYn3mMOec0EZRn4mDjBxs.jpeg"
        alt="Cork and Thorn VIP guests celebrating with bottle service and hookah"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/40" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="scroll-slide-right max-w-xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-secondary">
            Private Events
          </p>
          <h2 className="font-heading text-4xl leading-tight tracking-wide text-balance sm:text-5xl">
            Make your <span className="neon-text-secondary">celebration</span> unforgettable
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
            Cork &amp; Thorn would be honored to host your next celebration.
            Every event is bespoke to your tastes — from intimate gatherings to
            full venue buyouts with bottle service and live entertainment.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/private-parties" />}
              size="lg"
              className="shadow-glow-primary"
            >
              Plan Your Event
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/reservations" />}
              size="lg"
              variant="outline"
            >
              Bottle Service
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
