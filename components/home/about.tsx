import Image from 'next/image'
import { Wine, Cigarette, Music, UtensilsCrossed } from 'lucide-react'

const features = [
  {
    icon: Wine,
    title: 'Craft Cocktails',
    description:
      'Masterful mixes from our resident mixologists, plus an extensive top-shelf, wine, and champagne list.',
  },
  {
    icon: Cigarette,
    title: 'Premium Hookah',
    description:
      'Over 20 premium flavors and hand-carved fruit bowls, served the way the connoisseurs like it.',
  },
  {
    icon: Music,
    title: 'Live Entertainment',
    description:
      'Nightly R&B and hip-hop — from live bands and vocalists to resident DJs and open-mic nights.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Late-Night Bites',
    description:
      'Elevated shareable plates and late-night favorites to keep the energy going until last call.',
  },
]

export function About() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="scroll-slide-left relative aspect-[4/5] overflow-hidden rounded-2xl">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-07-10%20at%203.10.24%E2%80%AFAM.png-GHRmGXgO9PHfQDCsSjOMQ2VURiKYj3.jpeg"
            alt="Cork and Thorn live band performance with neon stage lighting"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-secondary/40" />
        </div>

        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-secondary">
            About Cork &amp; Thorn
          </p>
          <h2 className="font-heading text-4xl leading-tight tracking-wide text-balance sm:text-5xl">
            Premium vibes.
            <br />
            <span className="neon-text-secondary">World-class entertainment.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
            Tucked into the heart of Las Vegas, Cork &amp; Thorn is an intimate
            venue built for the night. Whether you&apos;re here for a date, a
            celebration, or simply the best vibe in the city, our team curates
            every detail — from the glass in your hand to the sound on the
            stage.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {features.map((feature, idx) => (
              <div key={feature.title} className="scroll-fade-in flex gap-4" style={{ animationDelay: `${idx * 100}ms` }}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
                  <feature.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
