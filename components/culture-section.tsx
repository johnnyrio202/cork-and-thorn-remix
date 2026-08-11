'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Crown, ShoppingBag, ArrowRight } from 'lucide-react'
import { InstagramIcon } from '@/components/social-icons'

const socials = [
  '@corkandthorn',
  '#MidnightGarden',
  '@vegasnightlife',
  '#TheInnerCircle',
  '@corkandthorn',
  '#LiveInTheRoom',
  '#UnapologeticVibe',
  '#SipsAndExhales',
]

export function CultureSection() {
  const [email, setEmail] = useState('')

  return (
    <section className="relative w-full bg-[#0B111B] px-6 pt-0 pb-0">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.35em] text-primary/80 mb-4">
            The Culture
          </p>
          <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl text-white">Join The Movement</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {/* Inner Circle — spans 2 cols */}
          <Link
            href="/loyalty"
            className="group relative md:col-span-2 min-h-[220px] md:min-h-[280px] rounded-2xl border border-primary/25 bg-white/[0.03] backdrop-blur-md p-8 md:p-10 flex flex-col justify-between overflow-hidden hover:border-primary/60 transition-colors duration-300"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_bottom_left,rgba(226,182,54,0.14),transparent_60%)]" />
            <Crown className="w-9 h-9 text-primary relative" strokeWidth={1.5} />
            <div className="relative">
              <h3 className="font-sans text-3xl md:text-4xl text-white mb-2">The Inner Circle</h3>
              <p className="font-sans text-gray-400 max-w-md mb-5">
                Unapologetic excellence. Member rewards, priority access, and off-menu perks.
                Loyalty login for the regulars who make this room what it is.
              </p>
              <span className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-widest text-primary">
                Member Login
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Apparel / Merch */}
          <Link
            href="/shop"
            className="group relative min-h-[220px] rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 flex flex-col justify-between overflow-hidden hover:border-primary/40 transition-colors duration-300"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(226,182,54,0.12),transparent_60%)]" />
            <ShoppingBag className="w-8 h-8 text-primary relative" strokeWidth={1.5} />
            <div className="relative">
              <h3 className="font-sans text-2xl text-white mb-1">Apparel / Merch</h3>
              <p className="font-sans text-sm text-gray-400">Wear the after-hours. Limited drops.</p>
            </div>
          </Link>

          {/* Newsletter */}
          <div className="group relative md:col-span-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 md:p-10 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="font-sans text-2xl md:text-3xl text-white mb-1">Newsletter</h3>
                <p className="font-sans text-sm md:text-base text-gray-400">
                  Guest lists, secret drops, and event drops&mdash;straight to your inbox.
                </p>
              </div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-[#0B111B]/60 backdrop-blur-md pl-5 pr-1.5 py-1.5 w-full md:w-auto md:min-w-[360px]"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-label="Email address"
                  className="flex-1 bg-transparent text-white placeholder:text-gray-500 font-sans text-sm outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-black shrink-0 hover:shadow-[0_0_24px_rgba(226,182,54,0.6)] transition-shadow"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Social marquee strip */}
      <div className="relative mt-16 md:mt-20 w-full overflow-hidden border-y border-white/10 py-5">
        <motion.div
          aria-hidden="true"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="flex shrink-0 items-center gap-10 whitespace-nowrap pr-10"
        >
          {[...socials, ...socials].map((handle, i) => (
            <span key={i} className="inline-flex items-center gap-3 font-sans text-lg text-gray-500">
              <InstagramIcon className="w-4 h-4 text-primary/70" />
              {handle}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
