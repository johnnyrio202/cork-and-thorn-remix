'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { events as allEvents, type EventItem } from '@/lib/data'

// ---------------------------------------------------------------------------
// Category → rule breakdown mapping (The Sound / The Code)
// ---------------------------------------------------------------------------
const VIBE_INTEL: Record<string, { sound: string; code: string }> = {
  'R&B':        { sound: 'Smooth R&B & Neo-Soul',           code: 'Sophisticated. Sensual. Noir.' },
  'Hip-Hop':    { sound: 'Classic & Current Hip-Hop',       code: 'Unapologetically Bold.' },
  'Live Band':  { sound: 'Live Soul, Funk & Hip-Hop',       code: 'Strictly Sophisticated Noir.' },
  'DJ Set':     { sound: 'Curated Afro-Beats & Deep House', code: 'Elevated. Immersive. Electric.' },
  'Open Mic':   { sound: 'Spoken Word, Vocals & Bars',      code: 'Raw. Authentic. Ours.' },
  'Game Night': { sound: 'Good Music. Better Vibes.',       code: 'Come correct. Leave legendary.' },
}

// Weekday ordering so the feed reads Wed → Sun the way the week actually flows
const DAY_ORDER = ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday']

function formatLongDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface EditorialEventFeedProps {
  onRSVP?: (event: EventItem) => void
  onBottleService?: (event: EventItem) => void
}

// ---------------------------------------------------------------------------
// Feed
// ---------------------------------------------------------------------------
export function EditorialEventFeed({ onRSVP, onBottleService }: EditorialEventFeedProps = {}) {
  // Collapse the recurring weekly programming into signature nights (first
  // upcoming occurrence of each), ordered by how the week actually flows.
  const signatureNights = useMemo(() => {
    const seen = new Map<string, EventItem>()
    for (const ev of allEvents) {
      if (!seen.has(ev.title)) seen.set(ev.title, ev)
    }
    return Array.from(seen.values()).sort(
      (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day),
    )
  }, [])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
      {signatureNights.map((ev, i) => (
        <FeedCard
          key={ev.id}
          event={ev}
          index={i}
          onRSVP={onRSVP}
          onBottleService={onBottleService}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
function FeedCard({
  event,
  index,
  onRSVP,
  onBottleService,
}: {
  event: EventItem
  index: number
  onRSVP?: (event: EventItem) => void
  onBottleService?: (event: EventItem) => void
}) {
  const vibe = VIBE_INTEL[event.category] ?? { sound: 'Good Music. Better Vibes.', code: 'Strictly Sophisticated Noir.' }

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative grid grid-cols-1 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0B111B] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_30px_80px_-40px_rgba(0,0,0,0.9)] transition-colors duration-500 hover:border-[#3A4A3F]/60 lg:grid-cols-[1.05fr_1fr]"
    >
      {/* Sage hover wash */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[#2E3B33]/0 transition-colors duration-500 group-hover:bg-[#2E3B33]/[0.14]" />

      {/* Left — cinematic visual */}
      <div className="relative min-h-[280px] overflow-hidden lg:min-h-[420px]">
        <img
          src={event.image || '/placeholder.svg'}
          alt={event.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B111B] via-[#0B111B]/20 to-transparent lg:bg-gradient-to-r" />
        {/* Category tag */}
        <span className="absolute left-6 top-6 z-20 rounded-full border border-[#E2B636]/40 bg-[#0B111B]/70 px-4 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-[#E2B636] backdrop-blur-md">
          {event.category}
        </span>
      </div>

      {/* Right — intel */}
      <div className="relative z-20 flex flex-col justify-center gap-6 p-8 sm:p-10 lg:p-12">
        <div>
          <p className="font-sans text-sm uppercase tracking-[0.35em] text-[#E2B636]/80">
            {formatLongDate(event.date)}
          </p>
          <h3 className="mt-3 font-serif text-4xl leading-[0.95] text-[#F5ECD2] text-balance sm:text-5xl lg:text-6xl">
            {event.title}
          </h3>
          <p className="mt-4 font-sans text-lg text-white/55">
            {event.artist} &middot; {event.time}
          </p>
        </div>

        {/* 2-column rule breakdown */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.04]">
          <RuleCell label="The Sound" value={vibe.sound} />
          <RuleCell label="The Code" value={vibe.code} />
        </div>

        {/* Action row */}
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => onRSVP?.(event)}
            className="flex-1 rounded-full border border-white/20 py-3.5 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-white/80 transition-all duration-200 hover:border-white/50 hover:text-white"
          >
            RSVP
          </button>
          <button
            onClick={() => onBottleService?.(event)}
            className="flex-1 rounded-full bg-[#E2B636] py-3.5 font-sans text-sm font-bold uppercase tracking-[0.18em] text-[#0B111B] shadow-[0_0_28px_-4px_rgba(226,182,54,0.6)] transition-all duration-200 hover:shadow-[0_0_44px_-2px_rgba(226,182,54,0.85)]"
          >
            Bottle Service
          </button>
        </div>
      </div>
    </motion.article>
  )
}

function RuleCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0B111B] p-5">
      <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/35">{label}</p>
      <p className="mt-1.5 font-serif text-lg leading-snug text-[#F5ECD2] text-pretty">{value}</p>
    </div>
  )
}
