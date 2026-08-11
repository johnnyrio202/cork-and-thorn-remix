'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, Music2, Mic2 } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Day = 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN' | 'MON' | 'TUE'

type NightEvent = {
  day: Day
  fullDay: string
  title: string
  talent: string
  time: string
  tag: string
  tagIcon: 'dj' | 'live' | 'karaoke'
  /** Fri & Sat show the "Secure a Table" button */
  tableService: boolean
}

// ---------------------------------------------------------------------------
// Data — WED first so the ribbon reads Wed → Thu → Fri → Sat → Sun → Mon → Tue
// ---------------------------------------------------------------------------
const EVENTS: NightEvent[] = [
  {
    day: 'WED', fullDay: 'Wednesday',
    title: 'Karaoke Night',
    talent: 'Ali Starr',
    time: '9 PM – 1 AM',
    tag: 'Karaoke',
    tagIcon: 'karaoke',
    tableService: false,
  },
  {
    day: 'THU', fullDay: 'Thursday',
    title: 'Thursday with Coso',
    talent: 'Coso',
    time: '9 PM – 2 AM',
    tag: 'DJ Set',
    tagIcon: 'dj',
    tableService: false,
  },
  {
    day: 'FRI', fullDay: 'Friday',
    title: 'Fresh Friday',
    talent: 'DJ Tone Arms',
    time: '10 PM – 3 AM',
    tag: 'DJ Set',
    tagIcon: 'dj',
    tableService: true,
  },
  {
    day: 'SAT', fullDay: 'Saturday',
    title: 'Sultry Saturday',
    talent: 'Ali Starr & the Alley Cats',
    time: '10 PM – 3 AM',
    tag: 'Live Music',
    tagIcon: 'live',
    tableService: true,
  },
  {
    day: 'SUN', fullDay: 'Sunday',
    title: 'R&B Session Sundays',
    talent: 'Kuntry 702',
    time: '8 PM – 1 AM',
    tag: 'Live R&B',
    tagIcon: 'live',
    tableService: false,
  },
  {
    day: 'MON', fullDay: 'Monday',
    title: 'Martini Mondays',
    talent: 'Industry Underground',
    time: '9 PM – 2 AM',
    tag: 'Industry Night',
    tagIcon: 'dj',
    tableService: false,
  },
  {
    day: 'TUE', fullDay: 'Tuesday',
    title: 'Tequila Tuesdays',
    talent: 'Industry Underground',
    time: '9 PM – 2 AM',
    tag: 'Industry Night',
    tagIcon: 'dj',
    tableService: false,
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function TagIcon({ type }: { type: NightEvent['tagIcon'] }) {
  if (type === 'karaoke') return <Mic2 className="w-3 h-3" />
  return <Music2 className="w-3 h-3" />
}

const cardVariants = {
  enter:  (d: number) => ({ opacity: 0, x: d * 44 }),
  center: { opacity: 1, x: 0 },
  exit:   (d: number) => ({ opacity: 0, x: d * -44 }),
}

const TRANSITION = { duration: 0.26, ease: [0.32, 0.72, 0, 1] as const }

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export type WeeklyRosterProps = {
  onRSVPClick?:  (event: NightEvent) => void
  onTableClick?: (event: NightEvent) => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function WeeklyRoster({ onRSVPClick, onTableClick }: WeeklyRosterProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const ribbonRef = useRef<HTMLDivElement>(null)

  const event = EVENTS[activeIdx]

  function go(nextIdx: number) {
    const clamped = (nextIdx + EVENTS.length) % EVENTS.length
    setDirection(clamped >= activeIdx ? 1 : -1)
    setActiveIdx(clamped)
  }

  // Keep selected pill centred in the scrollable ribbon
  useEffect(() => {
    const ribbon = ribbonRef.current
    if (!ribbon) return
    const pill = ribbon.querySelector<HTMLElement>('[data-active="true"]')
    pill?.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' })
  }, [activeIdx])

  return (
    <section aria-label="Weekly programming" className="flex flex-col w-full">

      {/* ── Section heading ─────────────────────────────────────────── */}
      <div className="mb-8">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-primary/70 mb-2">
          Live &amp; In The Room
        </p>
        <h2 className="font-sans text-3xl md:text-4xl text-white leading-tight">
          Weekly Line Up
        </h2>
      </div>

      {/* ── Day ribbon ──────────────────────────────────────────────── */}
      <div
        ref={ribbonRef}
        role="tablist"
        aria-label="Select a night"
        className="flex gap-2 overflow-x-auto pb-2 mb-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {EVENTS.map((ev, idx) => {
          const active = idx === activeIdx
          return (
            <button
              key={ev.day}
              role="tab"
              aria-selected={active}
              data-active={active}
              onClick={() => go(idx)}
              className={[
                'relative shrink-0 rounded-full px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                active
                  ? 'text-primary border border-primary/50 bg-primary/[0.08]'
                  : 'text-white/35 border border-white/[0.08] bg-white/[0.03] hover:text-white/65 hover:border-white/20',
              ].join(' ')}
              style={active ? { boxShadow: '0 0 18px rgba(226,182,54,0.28)' } : undefined}
            >
              {/* Shared layout glow pill */}
              {active && (
                <motion.span
                  layoutId="ribbon-glow"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(226,182,54,0.14) 0%, transparent 70%)',
                  }}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{ev.day}</span>
            </button>
          )
        })}
      </div>

      {/* ── Event card ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden flex-1">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeIdx}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={TRANSITION}
          >
            <div
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-sm overflow-hidden"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}
            >
              {/* Gold accent line */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/55 to-transparent" />

              <div className="p-6 md:p-8">

                {/* Tag + full day name */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                    <TagIcon type={event.tagIcon} />
                    {event.tag}
                  </span>
                  <span className="font-sans text-xs uppercase tracking-[0.2em] text-white/30">
                    {event.fullDay}
                  </span>
                </div>

                {/* Event title */}
                <h3 className="font-sans text-2xl md:text-3xl lg:text-4xl text-white mb-2 leading-tight text-balance">
                  {event.title}
                </h3>

                {/* Talent */}
                <p className="font-sans text-base md:text-lg text-white/50 mb-5">
                  {event.talent}
                </p>

                {/* Time */}
                <div className="flex items-center gap-2 text-white/30 mb-8">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span className="font-sans text-sm tracking-wide">{event.time}</span>
                </div>

                {/* ── CTA row ─────────────────────────────────────────── */}
                {event.tableService ? (
                  /* FRI & SAT — split row */
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Ghost: Guest List RSVP */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onRSVPClick?.(event)}
                      className="flex-1 rounded-xl border border-white/20 bg-transparent px-6 py-3.5 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-white/75 transition-colors hover:border-white/40 hover:text-white"
                    >
                      Guest List RSVP
                    </motion.button>

                    {/* Primary: Secure a Table — pulsing gold + magenta hover */}
                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        boxShadow: '0 0 48px rgba(226,182,54,0.65), 0 0 20px rgba(226,54,226,0.30)',
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onTableClick?.(event)}
                      className="flex-[1.35] rounded-xl bg-primary px-6 py-3.5 font-sans text-sm font-bold uppercase tracking-[0.18em] text-black"
                      style={{ boxShadow: '0 0 28px rgba(226,182,54,0.38)' }}
                    >
                      Secure a Table
                    </motion.button>
                  </div>
                ) : (
                  /* WED / THU / SUN / MON / TUE — single ghost button */
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onRSVPClick?.(event)}
                    className="rounded-xl border border-white/20 bg-transparent px-6 py-3.5 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-white/75 transition-colors hover:border-white/40 hover:text-white"
                  >
                    Guest List RSVP
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Prev / dots / Next ───────────────────────────────────── */}
        <div className="flex items-center justify-between mt-5 px-1">
          <button
            onClick={() => go(activeIdx - 1)}
            aria-label="Previous night"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/35 hover:text-white/80 hover:border-white/25 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {EVENTS.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to ${EVENTS[i].fullDay}`}
              >
                <motion.span
                  className="block rounded-full"
                  animate={{
                    width:      i === activeIdx ? 20 : 6,
                    height:     6,
                    background: i === activeIdx ? '#E2B636' : 'rgba(255,255,255,0.18)',
                    boxShadow:  i === activeIdx ? '0 0 8px rgba(226,182,54,0.7)' : 'none',
                  }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            ))}
          </div>

          <button
            onClick={() => go(activeIdx + 1)}
            aria-label="Next night"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/35 hover:text-white/80 hover:border-white/25 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default WeeklyRoster
