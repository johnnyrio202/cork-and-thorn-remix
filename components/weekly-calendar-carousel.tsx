'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import type { EventItem } from '@/lib/data'

// ---------------------------------------------------------------------------
// Day config
// ---------------------------------------------------------------------------
const DAYS = [
  { key: 'SUN', label: 'Sunday',    dataDay: 'Sunday',    tableService: false },
  { key: 'MON', label: 'Monday',    dataDay: 'Monday',    tableService: false },
  { key: 'TUE', label: 'Tuesday',   dataDay: 'Tuesday',   tableService: false },
  { key: 'WED', label: 'Wednesday', dataDay: 'Wednesday', tableService: false },
  { key: 'THU', label: 'Thursday',  dataDay: 'Thursday',  tableService: false },
  { key: 'FRI', label: 'Friday',    dataDay: 'Friday',    tableService: true  },
  { key: 'SAT', label: 'Saturday',  dataDay: 'Saturday',  tableService: true  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseTime(t: string): number {
  const [hm, meridiem] = t.split(' ')
  const [h, m] = hm.split(':').map(Number)
  return ((meridiem === 'PM' && h !== 12 ? h + 12 : meridiem === 'AM' && h === 12 ? 0 : h) * 60) + m
}

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

// todayRef is set client-side only to avoid SSR/client date mismatch.
// Pass it explicitly rather than calling new Date() at module/render scope.
function getEventsForDay(events: EventItem[], dayName: string, today: Date | null): EventItem[] {
  return events
    .filter(e => e.day === dayName)
    .filter(e => today === null || new Date(e.date + 'T00:00:00') >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
}

function isToday(iso: string, today: Date | null) {
  if (!today) return false
  return new Date(iso + 'T00:00:00').toDateString() === today.toDateString()
}

function formatDateLong(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}
function formatDateShort(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const EASE   = { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const }
const SPRING = { type: 'spring' as const, stiffness: 340, damping: 32 }

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export interface WeeklyCalendarCarouselProps {
  events: EventItem[]
  onTableClick?: (event: EventItem) => void
}

export function WeeklyCalendarCarousel({ events, onTableClick }: WeeklyCalendarCarouselProps) {
  const [dayIdx,   setDayIdx]   = useState(0)
  const [dayDir,   setDayDir]   = useState<1 | -1>(1)
  const [nightIdx, setNightIdx] = useState(0)
  const [nightDir, setNightDir] = useState<1 | -1>(1)
  const [slotIdx,  setSlotIdx]  = useState(0)
  const [slotDir,  setSlotDir]  = useState<1 | -1>(1)
  const [flyerOpen, setFlyerOpen] = useState(false)

  // `mounted` is false on the server and during the first client render so
  // both produce identical HTML. After hydration useEffect flips it to true
  // and the component re-renders with the real client-side date — eliminating
  // the SSR/client date mismatch that caused the hydration error.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    // Default the strip to today's day in PST/PDT (UTC-7 / UTC-8).
    // DAYS is ordered Sun=0 … Sat=6, matching getDay().
    const nowPST = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
    const pstDayIdx = nowPST.getDay() // 0=Sun … 6=Sat
    setDayIdx(pstDayIdx)
  }, [])
  const today = mounted ? (() => { const d = new Date(); d.setHours(0,0,0,0); return d })() : null

  const stripRef = useRef<HTMLDivElement>(null)

  const day        = DAYS[dayIdx]
  const allEvts    = getEventsForDay(events, day.dataDay, today)
  const showNights = groupByDate(allEvts)
  const night      = showNights[nightIdx] ?? null
  const activeEvt  = night?.evts[slotIdx] ?? null
  const tonight    = night ? isToday(night.date, today) : false
  const flyerSrc   = activeEvt?.image || '/images/venue-bar.jpeg'

  function goDay(next: number) {
    const c = (next + DAYS.length) % DAYS.length
    setDayDir(c >= dayIdx ? 1 : -1)
    setDayIdx(c)
  }
  function goNight(next: number) {
    if (!showNights.length) return
    const c = Math.max(0, Math.min(next, showNights.length - 1))
    setNightDir(c >= nightIdx ? 1 : -1)
    setNightIdx(c)
    setSlotIdx(0)
  }
  function goSlot(next: number) {
    if (!night) return
    const c = (next + night.evts.length) % night.evts.length
    setSlotDir(c >= slotIdx ? 1 : -1)
    setSlotIdx(c)
  }

  useEffect(() => { setNightIdx(0); setSlotIdx(0) }, [dayIdx])
  useEffect(() => { setSlotIdx(0) }, [nightIdx])

  useEffect(() => {
    // Deliberately not scrollIntoView: with block: 'nearest' it still drags
    // the whole page vertically to bring this strip into view whenever it's
    // off-screen at mount (e.g. this section is below the fold on first
    // load) — the classic footgun where "nearest" isn't actually "don't
    // scroll the page." Scrolling stripRef's own scrollLeft directly keeps
    // this strictly horizontal and never touches page scroll.
    const container = stripRef.current
    const active = container?.querySelector<HTMLElement>('[data-active="true"]')
    if (!container || !active) return
    const containerRect = container.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    const offset = activeRect.left - containerRect.left - (containerRect.width - activeRect.width) / 2
    container.scrollBy({ left: offset, behavior: 'smooth' })
  }, [dayIdx])

  return (
    <div className="w-full flex flex-col items-center gap-6">

      {/* ── Day strip ─────────────────────────────────────────────────────── */}
      <div
        ref={stripRef}
        role="tablist"
        aria-label="Select a day"
        className="flex justify-center gap-2 w-full overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {DAYS.map((d, idx) => {
          const active     = idx === dayIdx
          const dayEvts    = getEventsForDay(events, d.dataDay, today)
          const nights     = groupByDate(dayEvts)
          const nextNight  = nights[0]
          // Parse the ISO date string (YYYY-MM-DD) directly to avoid
          // UTC-vs-local-timezone offset that causes SSR/client hydration mismatches.
          const dateNum    = nextNight ? parseInt(nextNight.date.slice(8, 10), 10) : null
          const monthIdx   = nextNight ? parseInt(nextNight.date.slice(5, 7), 10) - 1 : null
          const MONTHS     = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
          const monthAbbr  = monthIdx !== null ? MONTHS[monthIdx] : null
          const hasTonight = dayEvts.some(e => isToday(e.date, today))
          const hasEvents  = dayEvts.length > 0

          return (
            <button
              key={d.key}
              role="tab"
              aria-selected={active}
              data-active={active}
              onClick={() => goDay(idx)}
              disabled={!hasEvents}
              className={[
                'relative shrink-0 flex flex-col items-center gap-1 rounded-2xl px-3 py-4 min-w-[72px] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                active
                  ? 'border border-primary/60 bg-primary/[0.08]'
                  : hasEvents
                    ? 'border border-white/[0.07] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] cursor-pointer'
                    : 'border border-white/[0.04] bg-white/[0.01] opacity-30 cursor-default',
              ].join(' ')}
              style={active ? { boxShadow: '0 0 28px rgba(226,182,54,0.22)' } : undefined}
            >
              {active && (
                <motion.span
                  layoutId="cal-glow"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'radial-gradient(ellipse at center 35%, rgba(226,182,54,0.13) 0%, transparent 70%)' }}
                  transition={SPRING}
                />
              )}

              <span className={[
                'relative font-sans text-[10px] font-bold uppercase tracking-[0.22em]',
                active ? 'text-primary' : 'text-white/35',
              ].join(' ')}>
                {d.key}
              </span>

              <span
                suppressHydrationWarning
                className={[
                  'relative font-serif leading-none',
                  dateNum !== null ? 'text-3xl' : 'text-xl',
                  active ? 'text-[#F5ECD2]' : 'text-white/50',
                ].join(' ')}
              >
                {dateNum ?? '—'}
              </span>

              <span suppressHydrationWarning className={[
                'relative font-sans text-[9px] uppercase tracking-[0.15em]',
                active ? 'text-primary/70' : 'text-white/20',
              ].join(' ')}>
                {monthAbbr ?? ''}
              </span>

              <span
                suppressHydrationWarning
                className={[
                  'absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-primary',
                  hasTonight ? 'opacity-100' : 'opacity-0',
                ].join(' ')}
              />
            </button>
          )
        })}
      </div>

      {/* ── Main panel ────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait" custom={dayDir}>
        <motion.div
          key={dayIdx}
          custom={dayDir}
          initial={{ opacity: 0, x: dayDir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dayDir * -40 }}
          transition={EASE}
          className="w-full"
        >
          {showNights.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] py-24 text-center">
              <p className="font-sans text-sm uppercase tracking-[0.28em] text-white/20">
                No upcoming dates — check back soon
              </p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8 items-start justify-center mx-auto w-full max-w-3xl">

              {/* ── LEFT: Flyer hero ──────────────────────────────────────── */}
              <div className="w-full md:w-auto shrink-0 flex justify-center">
                <AnimatePresence mode="wait" custom={slotDir}>
                  <motion.div
                    key={`${dayIdx}-${nightIdx}-${slotIdx}`}
                    custom={slotDir}
                    initial={{ opacity: 0, scale: 0.96, y: slotDir * 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: slotDir * -20 }}
                    transition={EASE}
                    className="relative rounded-2xl overflow-hidden group"
                    style={{
                      width: 260,
                      aspectRatio: '9/13',
                      boxShadow: '0 32px 80px rgba(0,0,0,0.70), 0 0 0 1px rgba(226,182,54,0.12)',
                    }}
                  >
                    <img
                      src={flyerSrc}
                      alt={activeEvt?.title ?? day.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Expand hint overlay */}
                    <button
                      onClick={() => setFlyerOpen(true)}
                      aria-label="View full flyer"
                      className="absolute inset-0 w-full h-full cursor-zoom-in"
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-2xl" />
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5" />
                        </svg>
                      </div>
                    </button>

                    {/* Bottom gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

                    {/* Tonight badge */}
                    {tonight && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                          Tonight
                        </span>
                      </div>
                    )}

                    {/* Slot arrows */}
                    {night && night.evts.length > 1 && (
                      <>
                        <button
                          onClick={() => goSlot(slotIdx - 1)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/55 border border-white/10 flex items-center justify-center hover:bg-black/75 transition-colors"
                          aria-label="Previous show"
                        >
                          <ChevronLeft className="w-4 h-4 text-white/75" />
                        </button>
                        <button
                          onClick={() => goSlot(slotIdx + 1)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/55 border border-white/10 flex items-center justify-center hover:bg-black/75 transition-colors"
                          aria-label="Next show"
                        >
                          <ChevronRight className="w-4 h-4 text-white/75" />
                        </button>

                        <div className="absolute bottom-24 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
                          {night.evts.map((_, i) => (
                            <span
                              key={i}
                              className={['w-1.5 h-1.5 rounded-full transition-colors', i === slotIdx ? 'bg-primary' : 'bg-white/25'].join(' ')}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Event label at bottom of flyer */}
                    {activeEvt && (
                      <div className="absolute bottom-0 inset-x-0 px-5 pb-5 pointer-events-none">
                        <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-white/40 mb-0.5">
                          {activeEvt.category}
                        </p>
                        <p className="font-serif text-xl text-[#F5ECD2] leading-tight">
                          {activeEvt.title}
                        </p>
                        <p className="font-sans text-xs text-white/40 mt-0.5">{activeEvt.artist}</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── RIGHT: info column ───────────────────────────────────── */}
              <div className="flex flex-col gap-3 flex-1 min-w-0 md:pt-2">

                {/* Date navigator */}
                <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2.5">
                  <button
                    onClick={() => goNight(nightIdx - 1)}
                    disabled={nightIdx === 0}
                    className="p-1 rounded-lg disabled:opacity-20 hover:bg-white/[0.06] transition-colors"
                    aria-label="Previous date"
                  >
                    <ChevronLeft className="w-4 h-4 text-white/50" />
                  </button>
                  <AnimatePresence mode="wait" custom={nightDir}>
                    <motion.span
                      key={`${dayIdx}-${nightIdx}`}
                      initial={{ opacity: 0, y: nightDir * 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: nightDir * -5 }}
                      transition={{ duration: 0.14 }}
                      className="font-sans text-sm text-white/60 tracking-wide text-center"
                    >
                      {night ? formatDateLong(night.date) : '—'}
                    </motion.span>
                  </AnimatePresence>
                  <button
                    onClick={() => goNight(nightIdx + 1)}
                    disabled={nightIdx >= showNights.length - 1}
                    className="p-1 rounded-lg disabled:opacity-20 hover:bg-white/[0.06] transition-colors"
                    aria-label="Next date"
                  >
                    <ChevronRight className="w-4 h-4 text-white/50" />
                  </button>
                </div>

                {/* Date pills */}
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
                            : 'border border-white/[0.07] bg-white/[0.02] text-white/35 hover:border-white/20 hover:text-white/55',
                        ].join(' ')}
                      >
                        {formatDateShort(n.date)}
                      </button>
                    ))}
                  </div>
                )}

                {/* Happy hour — shown first */}
                <div className="flex items-center gap-2 rounded-xl border border-primary/15 bg-primary/[0.04] px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70 leading-none mb-0.5">Happy Hour</p>
                    <p className="font-sans text-[10px] text-white/35">5:00 PM – 8:00 PM &nbsp;·&nbsp; Daily specials on cocktails &amp; hookah</p>
                  </div>
                  <span className="font-sans text-[9px] uppercase tracking-[0.12em] text-white/20 shrink-0">Every Day</span>
                </div>

                {/* Show slot pills */}
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
                            'w-full flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors duration-200',
                            active
                              ? 'border-primary/40 bg-primary/[0.07]'
                              : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]',
                          ].join(' ')}
                          style={active ? { boxShadow: '0 0 18px rgba(226,182,54,0.10)' } : undefined}
                          whileTap={{ scale: 0.985 }}
                        >
                          <div className={[
                            'shrink-0 flex flex-col items-center justify-center rounded-xl w-12 h-12 border',
                            active ? 'border-primary/40 bg-primary/[0.10]' : 'border-white/[0.08] bg-white/[0.03]',
                          ].join(' ')}>
                            <Clock className={['w-3 h-3 mb-0.5', active ? 'text-primary' : 'text-white/30'].join(' ')} />
                            <span className={['font-sans text-[10px] font-bold leading-none', active ? 'text-primary' : 'text-white/40'].join(' ')}>
                              {evt.time.replace(' PM', '').replace(' AM', '')}
                            </span>
                            <span className={['font-sans text-[8px] uppercase tracking-[0.1em]', active ? 'text-primary/60' : 'text-white/20'].join(' ')}>
                              {evt.time.includes('PM') ? 'PM' : 'AM'}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={['font-serif text-lg leading-tight truncate', active ? 'text-[#F5ECD2]' : 'text-white/65'].join(' ')}>
                              {evt.title}
                            </p>
                            <p className={['font-sans text-xs mt-0.5 truncate', active ? 'text-white/45' : 'text-white/25'].join(' ')}>
                              {evt.artist}
                            </p>
                          </div>

                          {active && <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />}
                        </motion.button>
                      )
                    })}
                  </div>
                )}

                {/* CTAs */}
                {activeEvt && (
                  <div className="flex gap-2 mt-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 rounded-xl border border-white/20 bg-transparent py-3 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-white/75 hover:border-white/40 hover:text-white transition-colors"
                    >
                      RSVP
                    </motion.button>
                    {day.tableService && parseTime(activeEvt.time) >= parseTime('11:00 PM') && (
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(226,182,54,0.60)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onTableClick?.(activeEvt)}
                        className="flex-1 rounded-xl bg-primary py-3 font-sans text-xs font-bold uppercase tracking-[0.22em] text-black"
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

      {/* ── Flyer lightbox ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {flyerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
            onClick={() => setFlyerOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

            {/* Image */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 24 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 max-h-[90vh] max-w-[min(520px,90vw)]"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={flyerSrc}
                alt={activeEvt?.title ?? day.label}
                className="w-full h-full object-contain rounded-2xl"
                style={{ maxHeight: '88vh', boxShadow: '0 40px 120px rgba(0,0,0,0.85), 0 0 0 1px rgba(226,182,54,0.18)' }}
              />

              {/* Close button */}
              <button
                onClick={() => setFlyerOpen(false)}
                aria-label="Close flyer"
                className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-black/80 border border-white/20 flex items-center justify-center hover:bg-black/95 transition-colors"
              >
                <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
