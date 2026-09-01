'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, Wine, Calendar } from 'lucide-react'
import type { EventItem } from '@/lib/data'

// ---------------------------------------------------------------------------
// Day config — starting Sunday
// ---------------------------------------------------------------------------
const DAYS = [
  { key: 'SUN', label: 'SUN', fullDay: 'Sunday',    dataDay: 'Sunday',    tableService: false },
  { key: 'MON', label: 'MON', fullDay: 'Monday',    dataDay: 'Monday',    tableService: false },
  { key: 'TUE', label: 'TUE', fullDay: 'Tuesday',   dataDay: 'Tuesday',   tableService: false },
  { key: 'WED', label: 'WED', fullDay: 'Wednesday', dataDay: 'Wednesday', tableService: false },
  { key: 'THU', label: 'THU', fullDay: 'Thursday',  dataDay: 'Thursday',  tableService: false },
  { key: 'FRI', label: 'FRI', fullDay: 'Friday',    dataDay: 'Friday',    tableService: true  },
  { key: 'SAT', label: 'SAT', fullDay: 'Saturday',  dataDay: 'Saturday',  tableService: true  },
]

// Flyer image per category — uses real uploaded flyers where available
const FLYER_IMAGE: Record<string, string> = {
  'Comedy':     '/images/flyer-comedy-jam.png',
  'DJ Set':     '/images/flyer-fresh-friday.png',
  'Live Music': '/images/flyer-industry-underground.png',
  'R&B':        '/images/performer-vocalist.jpeg',
  'Live Band':  '/images/performer-vocalist.jpeg',
  'Open Mic':   '/images/performer-mic.jpeg',
  'Hip-Hop':    '/images/event-dj-night.png',
  'Game Night': '/images/venue-bar.jpeg',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getEventsForDay(events: EventItem[], dayName: string): EventItem[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return events
    .filter(e => e.day === dayName)
    .filter(e => new Date(e.date + 'T00:00:00') >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
}

// Parse "H:MM AM/PM" time string to total minutes — used for sorting and VIP gate
function parseTime(t: string): number {
  const [hm, meridiem] = t.split(' ')
  const [h, m] = hm.split(':').map(Number)
  return ((meridiem === 'PM' && h !== 12 ? h + 12 : meridiem === 'AM' && h === 12 ? 0 : h) * 60) + m
}

// Group events by date — each date is a "show night" with possibly multiple events
type ShowNight = { date: string; evts: EventItem[] }
function groupByDate(evts: EventItem[]): ShowNight[] {
  const map: Record<string, EventItem[]> = {}
  evts.forEach(e => {
    if (!map[e.date]) map[e.date] = []
    map[e.date].push(e)
  })
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, evts]) => ({ date, evts: evts.sort((a, b) => parseTime(a.time) - parseTime(b.time)) }))
}

function formatDateLong(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}
function formatDateShort(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isToday(iso: string): boolean {
  return new Date(iso + 'T00:00:00').toDateString() === new Date().toDateString()
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface ExperiencesLineupProps {
  events: EventItem[]
  onRSVPClick?:  (event: EventItem) => void
  onTableClick?: (event: EventItem) => void
}

const SPRING = { type: 'spring' as const, stiffness: 380, damping: 34 }
const EASE   = { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const }

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ExperiencesLineup({ events, onRSVPClick, onTableClick }: ExperiencesLineupProps) {
  // Day selection
  const [dayIdx, setDayIdx]       = useState(0)
  const [dayDir, setDayDir]       = useState<1 | -1>(1)
  // Active show night within the selected day (index into showNights)
  const [nightIdx, setNightIdx]   = useState(0)
  const [nightDir, setNightDir]   = useState<1 | -1>(1)
  // Active event within the selected night (index into night.evts — the "slot")
  const [slotIdx, setSlotIdx]     = useState(0)
  const [slotDir, setSlotDir]     = useState<1 | -1>(1)

  const ribbonRef = useRef<HTMLDivElement>(null)

  const day        = DAYS[dayIdx]
  const allEvts    = getEventsForDay(events, day.dataDay)
  const showNights = groupByDate(allEvts)
  const night      = showNights[nightIdx]
  const activeEvt  = night?.evts[slotIdx] ?? null

  // Reset inner indices when day changes
  function goDay(next: number) {
    const clamped = (next + DAYS.length) % DAYS.length
    setDayDir(clamped >= dayIdx ? 1 : -1)
    setDayIdx(clamped)
    setNightIdx(0)
    setSlotIdx(0)
  }

  // Navigate between show nights (dates)
  function goNight(next: number) {
    if (!showNights.length) return
    const clamped = Math.max(0, Math.min(next, showNights.length - 1))
    setNightDir(clamped >= nightIdx ? 1 : -1)
    setNightIdx(clamped)
    setSlotIdx(0)
  }

  // Navigate between events on the same night (slots)
  function goSlot(next: number) {
    if (!night) return
    const clamped = (next + night.evts.length) % night.evts.length
    setSlotDir(clamped >= slotIdx ? 1 : -1)
    setSlotIdx(clamped)
  }

  // Reset night/slot when day changes
  useEffect(() => { setNightIdx(0); setSlotIdx(0) }, [dayIdx])
  useEffect(() => { setSlotIdx(0) }, [nightIdx])

  // Keep active calendar pill in view — scrollLeft directly rather than
  // scrollIntoView, which (even with block: 'nearest') drags the whole page
  // down vertically to reach this ribbon whenever it's off-screen at mount.
  useEffect(() => {
    const ribbon = ribbonRef.current
    const active = ribbon?.querySelector<HTMLElement>('[data-active="true"]')
    if (!ribbon || !active) return
    const ribbonRect = ribbon.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    const offset = activeRect.left - ribbonRect.left - (ribbonRect.width - activeRect.width) / 2
    ribbon.scrollBy({ left: offset, behavior: 'smooth' })
  }, [dayIdx])

  // Use the event's own image field first; fall back to category map, then generic
  const flyerSrc = activeEvt
    ? (activeEvt.image || FLYER_IMAGE[activeEvt.category] || '/images/event-dj-night.png')
    : '/images/venue-bar.jpeg'

  const tonight = night ? isToday(night.date) : false

  return (
    <section aria-label="Weekly lineup" className="w-full mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Heading ─────────────────────────────────────────────────────── */}
      <div className="mb-8 text-center">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-primary/70 mb-2">
          Live &amp; In The Room
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-[#F5ECD2] leading-tight">
          Weekly Line Up
        </h2>
      </div>

      {/* ── Calendar day ribbon ─────────────────────────────────────────── */}
      <div
        ref={ribbonRef}
        role="tablist"
        aria-label="Select a night"
        className="flex justify-center gap-2 overflow-x-auto pb-2 mb-8"
        style={{ scrollbarWidth: 'none' }}
      >
        {DAYS.map((d, idx) => {
          const active     = idx === dayIdx
          const dayEvts    = getEventsForDay(events, d.dataDay)
          const hasTonight = dayEvts.some(e => isToday(e.date))
          const nights     = groupByDate(dayEvts)
          const nextNight  = nights[0]
          const dateNum    = nextNight ? new Date(nextNight.date + 'T00:00:00').getDate() : null
          const monthAbbr  = nextNight
            ? new Date(nextNight.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })
            : null

          return (
            <button
              key={d.key}
              role="tab"
              aria-selected={active}
              data-active={active}
              onClick={() => goDay(idx)}
              className={[
                'relative shrink-0 flex flex-col items-center gap-0.5 rounded-2xl w-[72px] py-3 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                active
                  ? 'border border-primary/60 bg-primary/[0.08]'
                  : 'border border-white/[0.07] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]',
              ].join(' ')}
              style={active ? { boxShadow: '0 0 22px rgba(226,182,54,0.30)' } : undefined}
            >
              {active && (
                <motion.span
                  layoutId="exp-cal-glow"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'radial-gradient(ellipse at center 40%, rgba(226,182,54,0.13) 0%, transparent 75%)' }}
                  transition={SPRING}
                />
              )}
              <span className={['relative font-sans text-[10px] font-semibold uppercase tracking-[0.2em]', active ? 'text-primary' : 'text-white/35'].join(' ')}>
                {d.label}
              </span>
              <span className={['relative font-serif leading-none', dateNum !== null ? 'text-2xl' : 'text-lg', active ? 'text-[#F5ECD2]' : 'text-white/50'].join(' ')}>
                {dateNum ?? '—'}
              </span>
              {monthAbbr && (
                <span className={['relative font-sans text-[9px] uppercase tracking-[0.15em]', active ? 'text-primary/70' : 'text-white/20'].join(' ')}>
                  {monthAbbr}
                </span>
              )}
              {hasTonight && <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          )
        })}
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait" custom={dayDir}>
        <motion.div
          key={dayIdx}
          custom={dayDir}
          initial={{ opacity: 0, x: dayDir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dayDir * -40 }}
          transition={EASE}
        >
          {showNights.length === 0 ? (
            /* No events */
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-12 text-center">
              <p className="font-sans text-sm uppercase tracking-[0.25em] text-white/25">
                No upcoming dates — check back soon
              </p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-4 items-start">

              {/* ── LEFT: Full flyer ─────────────────────────────────────── */}
              <div className="w-full lg:w-[340px] shrink-0">

                {/* Flyer slot — animates between events on the same night */}
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    aspectRatio: '9/13',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(226,182,54,0.10)',
                  }}
                >
                  <AnimatePresence mode="wait" custom={slotDir}>
                    <motion.img
                      key={`${dayIdx}-${nightIdx}-${slotIdx}`}
                      custom={slotDir}
                      src={flyerSrc}
                      alt={activeEvt?.title ?? day.fullDay}
                      initial={{ opacity: 0, y: slotDir * 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: slotDir * -20 }}
                      transition={EASE}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Bottom gradient + event label */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                  {/* Tonight badge */}
                  {tonight && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                        Tonight
                      </span>
                    </div>
                  )}

                  {/* Slot arrows — only show if multiple events on same night */}
                  {night && night.evts.length > 1 && (
                    <>
                      <button
                        onClick={() => goSlot(slotIdx - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center hover:bg-black/70 transition-colors"
                        aria-label="Previous show"
                      >
                        <ChevronLeft className="w-4 h-4 text-white/70" />
                      </button>
                      <button
                        onClick={() => goSlot(slotIdx + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center hover:bg-black/70 transition-colors"
                        aria-label="Next show"
                      >
                        <ChevronRight className="w-4 h-4 text-white/70" />
                      </button>

                      {/* Slot dots */}
                      <div className="absolute bottom-14 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
                        {night.evts.map((_, i) => (
                          <span
                            key={i}
                            className={['w-1.5 h-1.5 rounded-full transition-colors', i === slotIdx ? 'bg-primary' : 'bg-white/25'].join(' ')}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Event title at bottom of flyer */}
                  {activeEvt && (
                    <div className="absolute bottom-0 inset-x-0 px-4 pb-4 pointer-events-none">
                      <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/50 mb-0.5">
                        {activeEvt.category}
                      </p>
                      <p className="font-serif text-lg text-[#F5ECD2] leading-tight">
                        {activeEvt.title}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── RIGHT: Info + timeslots ──────────────────────────────── */}
              <div className="flex-1 min-w-0 flex flex-col gap-3">

                {/* Happy Hour banner */}
                <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/[0.06] px-4 py-3">
                  <Wine className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-primary leading-none mb-0.5">
                      Happy Hour
                    </p>
                    <p className="font-sans text-xs text-white/45">
                      5:00 PM – 8:00 PM &nbsp;·&nbsp; Daily specials on cocktails &amp; hookah
                    </p>
                  </div>
                  <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-white/25 shrink-0">Every Day</span>
                </div>

                {/* Date navigator */}
                <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2.5">
                  <button
                    onClick={() => goNight(nightIdx - 1)}
                    disabled={nightIdx === 0}
                    className="p-1 rounded-lg disabled:opacity-20 hover:bg-white/[0.06] transition-colors"
                    aria-label="Previous date"
                  >
                    <ChevronLeft className="w-4 h-4 text-white/50" />
                  </button>

                  <div className="flex items-center gap-2 text-center">
                    <Calendar className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                    <AnimatePresence mode="wait" custom={nightDir}>
                      <motion.span
                        key={`${dayIdx}-${nightIdx}`}
                        initial={{ opacity: 0, y: nightDir * 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: nightDir * -8 }}
                        transition={{ duration: 0.18 }}
                        className="font-sans text-sm text-white/70 tracking-wide"
                      >
                        {night ? formatDateLong(night.date) : '—'}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={() => goNight(nightIdx + 1)}
                    disabled={nightIdx >= showNights.length - 1}
                    className="p-1 rounded-lg disabled:opacity-20 hover:bg-white/[0.06] transition-colors"
                    aria-label="Next date"
                  >
                    <ChevronRight className="w-4 h-4 text-white/50" />
                  </button>
                </div>

                {/* Upcoming date pills for quick jump */}
                {showNights.length > 1 && (
                  <div className="flex flex-wrap gap-1.5">
                    {showNights.slice(0, 6).map((n, i) => (
                      <button
                        key={n.date}
                        onClick={() => { setNightDir(i >= nightIdx ? 1 : -1); setNightIdx(i); setSlotIdx(0) }}
                        className={[
                          'rounded-lg px-2.5 py-1 font-sans text-[11px] font-semibold transition-colors',
                          i === nightIdx
                            ? 'bg-primary/15 border border-primary/40 text-primary'
                            : 'border border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white/60',
                        ].join(' ')}
                      >
                        {formatDateShort(n.date)}
                      </button>
                    ))}
                  </div>
                )}

                {/* Showtime slot pills — one per event on the selected night */}
                {night && (
                  <div className="flex flex-col gap-2">
                    {night.evts.map((evt, i) => {
                      const active = i === slotIdx
                      return (
                        <motion.button
                          key={evt.id}
                          layout
                          onClick={() => { setSlotDir(i >= slotIdx ? 1 : -1); setSlotIdx(i) }}
                          className={[
                            'w-full flex items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-colors duration-200',
                            active
                              ? 'border-primary/40 bg-primary/[0.07]'
                              : 'border-white/[0.07] bg-white/[0.025] hover:border-white/[0.14] hover:bg-white/[0.04]',
                          ].join(' ')}
                          style={active ? { boxShadow: '0 0 24px rgba(226,182,54,0.12)' } : undefined}
                          whileTap={{ scale: 0.985 }}
                        >
                          {/* Time bubble */}
                          <div className={[
                            'shrink-0 flex flex-col items-center justify-center rounded-xl w-14 h-14 border',
                            active ? 'border-primary/40 bg-primary/[0.10]' : 'border-white/[0.08] bg-white/[0.03]',
                          ].join(' ')}>
                            <Clock className={['w-3.5 h-3.5 mb-0.5', active ? 'text-primary' : 'text-white/30'].join(' ')} />
                            <span className={['font-sans text-[10px] font-bold leading-none', active ? 'text-primary' : 'text-white/40'].join(' ')}>
                              {evt.time.replace(' PM', '').replace(' AM', '')}
                            </span>
                            <span className={['font-sans text-[8px] uppercase tracking-[0.1em]', active ? 'text-primary/60' : 'text-white/20'].join(' ')}>
                              {evt.time.includes('PM') ? 'PM' : 'AM'}
                            </span>
                          </div>

                          {/* Event info */}
                          <div className="flex-1 min-w-0">
                            <p className={['font-serif text-xl leading-tight truncate', active ? 'text-[#F5ECD2]' : 'text-white/70'].join(' ')}>
                              {evt.title}
                            </p>
                            <p className={['font-sans text-xs mt-0.5 truncate', active ? 'text-white/45' : 'text-white/25'].join(' ')}>
                              {evt.artist}
                            </p>
                          </div>

                          {/* Active indicator */}
                          {active && (
                            <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                )}

                {/* CTA buttons */}
                {activeEvt && (
                  <div className="flex gap-2.5 mt-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onRSVPClick?.(activeEvt)}
                      className="flex-1 rounded-xl border border-white/20 bg-transparent py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-white/75 hover:border-white/40 hover:text-white transition-colors"
                    >
                      RSVP
                    </motion.button>
                    {day.tableService && parseTime(activeEvt.time) >= parseTime('11:00 PM') && (
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(226,182,54,0.60)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onTableClick?.(activeEvt)}
                        className="flex-1 rounded-xl bg-primary py-3.5 font-sans text-xs font-bold uppercase tracking-[0.22em] text-black"
                        style={{ boxShadow: '0 0 24px rgba(226,182,54,0.35)' }}
                      >
                        VIP Table
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
