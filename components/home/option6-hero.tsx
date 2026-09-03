import Image from 'next/image'
import Link from 'next/link'

// Cocktails stays centered/raised; Hookah and Cigars sit ~1/3 of the panel
// height lower on either side — a fixed offset, not a size difference, so
// the hover-grow effect applies equally to all three.
const TRIO = [
  { key: 'hookah', label: 'Hookah', image: '/images/event-hookah.png', href: '/menu?t1=exhales&t2=hookah', offset: true },
  { key: 'cocktails', label: 'Cocktails', image: '/images/cocktail.png', href: '/menu?t1=sips&t2=cocktails', offset: false },
  { key: 'cigars', label: 'Cigars', image: '/images/cigar-tasting.jpg', href: '/menu?t1=exhales&t2=cigars', offset: true },
] as const

export function Option6Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0B111B] px-6 pb-[118px] pt-16 md:pt-20">
      <Image src="/images/hero-lounge.png" alt="" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B111B]/35 via-[#0B111B]/55 to-[#0B111B]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Centered, soft-masked video — in normal flow so the tagline
            below it always has real clearance, never an overlap. */}
        <div
          className="relative mx-auto mb-10 aspect-[16/10] w-full max-w-[92vw] overflow-hidden rounded-[28px] md:max-w-[780px]"
          style={{
            WebkitMaskImage:
              'radial-gradient(ellipse 62% 60% at 50% 50%, black 45%, transparent 90%)',
            maskImage:
              'radial-gradient(ellipse 62% 60% at 50% 50%, black 45%, transparent 90%)',
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            style={{ filter: 'saturate(0.9) brightness(0.85)' }}
            src="https://static.spotapps.co/website_videos/Cork_And_Thorn_Vimeo720p30.mp4"
          />
        </div>

        <div className="flex flex-wrap items-baseline justify-center gap-3 text-center md:gap-6">
          <span className="font-script text-2xl italic text-bone/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] md:text-4xl">
            The way
          </span>
          <span className="inline-flex items-center rounded-2xl border border-primary/50 bg-[#0B111B]/45 px-6 py-2 shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <span className="font-sans text-3xl font-bold text-primary drop-shadow-[0_0_20px_rgba(226,182,54,0.6)] md:text-5xl">
              Nightlife
            </span>
          </span>
          <span className="font-script text-2xl italic text-bone/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] md:text-4xl">
            should be
          </span>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/reservations"
            className="rounded-full bg-primary px-7 py-3 text-sm font-semibold uppercase tracking-wide text-black shadow-glow-primary"
          >
            Reserve a Table
          </Link>
          <Link
            href="/events"
            className="rounded-full border border-primary/50 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-foreground"
          >
            View Events
          </Link>
        </div>

        <div className="group/trio mt-8 flex items-end justify-center gap-3 md:gap-7">
          {TRIO.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`relative block h-[134px] w-[100px] shrink-0 overflow-hidden rounded-2xl border border-primary/35 shadow-[0_14px_40px_rgba(0,0,0,0.55)] transition-all duration-300 hover:z-10 hover:scale-[1.2] hover:border-primary/70 hover:opacity-100 group-hover/trio:opacity-60 md:h-[211px] md:w-[157px] ${
                item.offset ? 'translate-y-[50px] md:translate-y-[70px]' : ''
              }`}
            >
              <Image src={item.image} alt={item.label} fill className="object-cover" sizes="160px" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B111B]/85 to-transparent px-2 pb-2 pt-6 text-center text-[9.5px] font-medium uppercase tracking-[0.14em] text-bone">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
