'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Wine, Sparkles, Leaf, Grape, GlassWater, Wind, Cigarette, ArrowRight, Beer } from 'lucide-react'

type MenuItem = {
  title: string
  blurb: string
  icon: React.ElementType
  // section ID on /menu?section=<id> — null means no deep-link (exhales)
  section: string | null
}

// href encodes t1 + t2 + optional t3 so FullMenuMatrix can read them on mount
// and immediately expand to the exact selection.
const sips: MenuItem[] = [
  {
    title: 'The Blooms',
    blurb: 'Floral, aromatic craft cocktails built to impress.',
    icon: Sparkles,
    section: 't1=sips&t2=cocktails&t3=vol1',
  },
  {
    title: 'The Roots',
    blurb: 'Earthy, spirit-forward classics with a Cork & Thorn twist.',
    icon: Leaf,
    section: 't1=sips&t2=cocktails&t3=vol2',
  },
  {
    title: 'The Mock Garden',
    blurb: 'Zero-proof botanicals for the clear-headed crowd.',
    icon: Grape,
    section: 't1=sips&t2=cocktails&t3=vol3',
  },
  {
    title: 'Spirits & Bottles',
    blurb: 'Curated back bar — from well pours to Clase Azul, table-side.',
    icon: Wine,
    section: 't1=sips&t2=spirits&t3=vodka',
  },
  {
    title: 'Wine & Bubbles',
    blurb: 'Reds, whites, rosé, and VIP champagne bottle service.',
    icon: GlassWater,
    section: 't1=sips&t2=wine&t3=red',
  },
  {
    title: 'Beer',
    blurb: 'Bottles & imports from $8. Mix & match buckets for the table.',
    icon: Beer,
    section: 't1=sips&t2=beer',
  },
]

const exhales: MenuItem[] = [
  {
    title: 'Premium Hookah',
    blurb: 'Hand-packed bowls, premium leaf, glass on ice.',
    icon: Wind,
    section: 't1=exhales&t2=hookah',
  },
  {
    title: 'Cigars',
    blurb: 'A quiet ritual — reserve stock, cut, and lit table-side.',
    icon: Cigarette,
    section: 't1=exhales&t2=cigars',
  },
]

function Card({ item, index }: { item: MenuItem; index: number }) {
  const Icon = item.icon
  const href = item.section ? `/menu?${item.section}` : '/menu'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.06 }}
    >
      <Link
        href={href}
        className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 md:p-8 hover:border-primary/40 transition-colors duration-300 overflow-hidden h-full"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(226,182,54,0.12),transparent_60%)]" />
        <Icon className="w-7 h-7 text-primary mb-5 relative" strokeWidth={1.5} />
        <h3 className="font-sans text-xl md:text-2xl text-white mb-2 relative">{item.title}</h3>
        <p
          className="font-sans text-sm md:text-base text-gray-400 leading-relaxed relative flex-1"
          dangerouslySetInnerHTML={{ __html: item.blurb }}
        />
        <span className="mt-5 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-primary/60 group-hover:text-primary transition-colors duration-200 relative">
          View menu
          <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.div>
  )
}

export function MidnightGarden() {
  const [tab, setTab] = useState<'sips' | 'exhales'>('sips')
  const items = tab === 'sips' ? sips : exhales

  return (
    <section className="relative w-full bg-[#0B111B] px-6 pt-[59px] pb-[150px]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.35em] text-primary/80 mb-4">
            The Midnight Garden
          </p>
          <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl text-white">Sips &amp; Exhales</h2>
        </div>

        {/* Glassmorphic toggle */}
        <div className="flex justify-center mb-12 md:mb-16">
          <div className="relative inline-flex rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md p-1.5">
            {(['sips', 'exhales'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`relative z-10 px-8 sm:px-12 py-3 rounded-full text-sm font-medium uppercase tracking-widest transition-colors duration-300 ${
                  tab === key ? 'text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === key && (
                  <motion.span
                    layoutId="garden-tab"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-primary shadow-[0_0_24px_rgba(226,182,54,0.5)]"
                  />
                )}
                <span className="relative">{key === 'sips' ? 'Sips' : 'Exhales'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          >
            {items.map((item, i) => (
              <Card key={item.title} item={item} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View Full Menu CTA */}
        <div className="flex justify-center mt-10 md:mt-12">
          <Link
            href="/menu"
            className="group relative inline-flex items-center gap-3 rounded-full border border-primary/30 bg-white/[0.02] backdrop-blur-md px-8 py-4 text-sm uppercase tracking-[0.25em] text-white/70 hover:text-black hover:border-primary transition-colors duration-300 overflow-hidden"
          >
            <motion.span
              className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_32px_rgba(226,182,54,0.5)]"
            />
            <span className="relative">View Full Menu</span>
            <ArrowRight className="w-4 h-4 relative transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Secret menu lock */}
        <div className="flex justify-center mt-16 md:mt-24">
          <Link
            href="/secret-menu"
            className="group flex flex-col items-center gap-4 text-center"
          >
            <span className="relative flex items-center justify-center w-16 h-16 rounded-full border border-primary/30 bg-white/[0.02] backdrop-blur-md transition-all duration-500 group-hover:border-primary group-hover:shadow-[0_0_40px_rgba(226,182,54,0.5)]">
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-primary/10 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
              />
              <Lock className="w-6 h-6 text-primary relative" strokeWidth={1.5} />
            </span>
            <span className="font-sans text-sm uppercase tracking-[0.3em] text-gray-400 group-hover:text-primary transition-colors duration-300">
              Unlock the Secret Menu
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
