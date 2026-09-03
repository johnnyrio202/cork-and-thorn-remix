import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Suspense } from 'react'
import { FullMenuMatrix } from '@/components/full-menu-matrix'

export const metadata = {
  title: 'Sips & Exhales | Cork & Thorn',
  description:
    'Full menu at Cork & Thorn — craft cocktails, top-shelf spirits & bottle service, premium hookah, cigars, wine, bubbles, and beer. OTD pricing.',
}

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#0B111B]">

      {/* Hero bar */}
      <div className="relative border-b border-white/[0.06] overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(226,182,54,0.45) 50%, transparent)',
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 md:pt-8 md:pb-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/40 hover:text-primary transition-colors duration-200 mb-6 group justify-center"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Cork &amp; Thorn
          </Link>

          <p className="font-sans text-xs uppercase tracking-[0.35em] text-primary/70 mb-3">
            The Midnight Garden
          </p>
          <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl text-white leading-tight tracking-tight mb-4">
            Sips &amp; Exhales
          </h1>

          <p className="mt-4 mx-auto max-w-2xl font-sans text-sm text-white/60 leading-relaxed text-pretty">
            Every pour, bowl, and bottle here is built around one promise: an
            exceptional experience with nothing hidden. We take pride in the
            craft, the hospitality, and the honesty behind it.
          </p>

          <p className="mt-3 mx-auto max-w-2xl font-sans text-sm text-white/75 leading-relaxed text-pretty">
            <span className="text-primary font-medium block">20% auto gratuity — tax and gratuity is already applied.</span>
            No surprise line items, no math at the end of the night — what you see is what you pay. Explore our Seasonal Craft Menu below.
          </p>
        </div>
      </div>

      <Suspense>
        <FullMenuMatrix />
      </Suspense>
    </div>
  )
}
