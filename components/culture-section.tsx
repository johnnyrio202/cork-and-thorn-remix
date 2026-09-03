'use client'

import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'

// Was a 3-card grid (Inner Circle / Shop / inline Newsletter form). Inner
// Circle linked to /loyalty, already deprioritized (VIP Access is the
// intended eventual home for member-facing entry points, not this page).
// The Newsletter form duplicated the footer's own signup — one per site,
// kept in the footer. What's left is the Shop teaser, at the new scale.
export function CultureSection() {
  return (
    <section className="relative w-full bg-[#0B111B] px-6 pt-0 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-primary/80 mb-3">
            The Culture
          </p>
          <h2 className="font-sans text-2xl sm:text-3xl text-white">Join The Movement</h2>
        </div>

        <Link
          href="/shop"
          className="group relative mx-auto flex max-w-md flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 text-center hover:border-primary/40 transition-colors duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top,rgba(226,182,54,0.12),transparent_60%)]" />
          <ShoppingBag className="w-6 h-6 text-primary mb-3 relative" strokeWidth={1.5} />
          <h3 className="font-sans text-lg text-white mb-1 relative">Apparel / Merch</h3>
          <p className="font-sans text-xs text-gray-400 mb-4 relative">
            Wear the after-hours. Limited drops.
          </p>
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-primary/60 group-hover:text-primary transition-colors duration-200 relative">
            Shop now
            <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </section>
  )
}
