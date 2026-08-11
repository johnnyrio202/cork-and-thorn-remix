'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, X } from 'lucide-react'
import { events, type EventItem } from '@/lib/data'
import { ExperiencePortal } from '@/components/experience-portal'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseLocalDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function isoFor(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const CATEGORY_COLORS: Record<string, string> = {
  'R&B':        'bg-[#FF2D78]/80',
  'Hip-Hop':    'bg-[#00FFFF]/70',
  'Live Band':  'bg-[#E2B636]/80',
  'DJ Set':     'bg-[#a855f7]/80',
  'Open Mic':   'bg-[#22d3ee]/70',
  'Game Night': 'bg-[#84cc16]/70',
}

// ---------------------------------------------------------------------------
// Day cell
// ---------------------------------------------------------------------------
function DayCell({
  day,
  dayEvents,
  isSelected,
  isToday,
  onClick,
}: {
  day: number | null
  dayEvents: EventItem[]
  isSelected: boolean
  isToday: boolean
  onClick: () => void
}) {
  if (day === null) return <div className="aspect-square rounded-xl" />

  const hasEvents = dayEvents.length > 0

  return (
    <motion.button
      onClick={hasEvents ? onClick : undefined}
      whileHover={hasEvents ? { scale: 1.04 } : {}}
      whileTap={hasEvents ? { scale: 0.97 } : {}}
      className={[
        'relative aspect-square rounded-xl flex flex-col items-center justify-start pt-2 px-1 transition-all duration-200 overflow-hidden',
        hasEvents
          ? isSelected
            ? 'bg-primary/20 border border-primary shadow-[0_0_18px_rgba(226,182,54,0.35)] cursor-pointer'
            : 'bg-white/[0.04] border border-white/[0.08] hover:border-primary/40 cursor-pointer'
          : 'bg-transparent border border-transparent cursor-default',
        isToday && !isSelected ? 'border-white/20' : '',
      ].join(' ')}
    >
      <span className={[
        'font-sans text-xs font-semibold leading-none z-10',
        isSelected ? 'text-primary' : isToday ? 'text-white' : hasEvents ? 'text-white/80' : 'text-white/20',
      ].join(' ')}>
        {day}
      </span>

      {isToday && (
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(226,182,54,0.9)]" />
      )}

      {hasEvents && (
        <div className="mt-1.5 flex flex-col gap-0.5 w-full px-0.5 z-10">
          {dayEvents.slice(0, 2).map((e) => (
            <span
              key={e.id}
              className={[
                'rounded-sm px-1 py-px font-sans text-[7px] font-bold uppercase tracking-wide text-[#0B111B] truncate',
                CATEGORY_COLORS[e.category] ?? 'bg-white/40',
              ].join(' ')}
            >
              {e.artist.split(' ')[0]}
            </span>
          ))}
          {dayEvents.length > 2 && (
            <span className="font-sans text-[7px] text-white/30 pl-1">
              +{dayEvents.length - 2}
            </span>
          )}
        </div>
      )}
    </motion.button>
  )
}

// ---------------------------------------------------------------------------
// Event list item
// ---------------------------------------------------------------------------
function EventListItem({ event, onSelect }: { event: EventItem; onSelect: () => void }) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ x: 4 }}
      className="group w-full text-left flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 hover:border-primary/30 hover:bg-white/[0.06] transition-all"
    >
      <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0B111B]/30" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={[
            'rounded-sm px-1.5 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider text-[#0B111B]',
            CATEGORY_COLORS[event.category] ?? 'bg-white/30',
          ].join(' ')}>
            {event.category}
          </span>
          <span className="font-sans text-[10px] text-white/35 uppercase tracking-widest">
            {event.day}
          </span>
        </div>
        <p className="font-sans text-sm font-semibold text-white truncate">{event.title}</p>
        <p className="font-sans text-xs text-primary/80 truncate">{event.artist}</p>
        <div className="flex items-center gap-1 mt-1">
          <Clock className="w-3 h-3 text-white/30" />
          <span className="font-sans text-[10px] text-white/35">{event.time}</span>
        </div>
      </div>
      <div className="shrink-0 self-center">
        <span className="font-sans text-xs font-bold text-primary">
          {event.price === 0 ? 'Free' : `$${event.price}`}
        </span>
      </div>
    </motion.button>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
interface EventsExplorerProps {
  onSecureTable?: (date: string) => void
}

export function EventsExplorer({ onSecureTable }: EventsExplorerProps = {}) {
  const today = new Date()

  const [viewYear,  setViewYear]  = useState(2026)
  const [viewMonth, setViewMonth] = useState(6) // July 2026
  const [selectedDate,  setSelectedDate]  = useState<string | null>(null)
  const [portalEvent,   setPortalEvent]   = useState<EventItem | null>(null)

  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>()
    for (const e of events) {
      map.set(e.date, [...(map.get(e.date) ?? []), e])
    }
    return map
  }, [])

  const monthLabel = new Date(viewYear, viewMonth).toLocaleString('en-US', {
    month: 'long', year: 'numeric',
  })

  const firstDayOffset = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth    = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  function changeMonth(delta: number) {
    let m = viewMonth + delta
    let y = viewYear
    if (m < 0)  { m = 11; y -= 1 }
    if (m > 11) { m = 0;  y += 1 }
    setViewMonth(m)
    setViewYear(y)
    setSelectedDate(null)
  }

  const monthEvents = events.filter((e) => {
    const d = parseLocalDate(e.date)
    return d.getFullYear() === viewYear && d.getMonth() === viewMonth
  })

  const listEvents = selectedDate
    ? (eventsByDate.get(selectedDate) ?? [])
    : monthEvents

  // ── Portal view ───────────────────────────────────────────────────────────
  if (portalEvent) {
    return (
      <AnimatePresence>
        <motion.div
          key="portal"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <button
            onClick={() => setPortalEvent(null)}
            className="fixed top-24 left-6 z-[70] flex items-center gap-2 rounded-full border border-white/10 bg-[#0B111B]/80 backdrop-blur-xl px-4 py-2 font-sans text-xs text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Calendar
          </button>
          <ExperiencePortal
            event={portalEvent}
            onRSVPClick={() => {}}
            onTableClick={() => {
              if (onSecureTable) {
                onSecureTable(portalEvent.date)
                setPortalEvent(null)
              }
            }}
          />
        </motion.div>
      </AnimatePresence>
    )
  }

  // ── Calendar view ─────────────────────────────────────────────────────────
  return (
    <section className="min-h-screen bg-[#0B111B] px-4 py-10 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">

        {/* Month header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-primary/50 mb-1">
              Event Calendar
            </p>
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-white">
              {monthLabel}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/50 hover:text-white hover:border-white/25 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
              onClick={() => changeMonth(1)}
              aria-label="Next month"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/50 hover:text-white hover:border-white/25 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Calendar + sidebar */}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* Calendar grid */}
          <div>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center font-sans text-[10px] uppercase tracking-[0.2em] text-white/25 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-2">
              {cells.map((day, i) => {
                const iso       = day ? isoFor(viewYear, viewMonth, day) : ''
                const dayEvents = iso ? (eventsByDate.get(iso) ?? []) : []
                const isToday   = day !== null &&
                  viewYear  === today.getFullYear() &&
                  viewMonth === today.getMonth() &&
                  day       === today.getDate()
                return (
                  <DayCell
                    key={i}
                    day={day}
                    dayEvents={dayEvents}
                    isSelected={selectedDate === iso}
                    isToday={isToday}
                    onClick={() => setSelectedDate(selectedDate === iso ? null : iso)}
                  />
                )
              })}
            </div>

            {/* Category legend */}
            <div className="mt-6 flex flex-wrap gap-3">
              {Object.entries(CATEGORY_COLORS).map(([cat, cls]) => (
                <span key={cat} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-sm ${cls}`} />
                  <span className="font-sans text-[10px] text-white/35 uppercase tracking-wider">
                    {cat}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Event sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-md p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-sans text-xs uppercase tracking-[0.3em] text-white/40">
                  {selectedDate
                    ? parseLocalDate(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long', month: 'short', day: 'numeric',
                      })
                    : `${listEvents.length} nights this month`}
                </p>
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-white/30 hover:text-white/70 transition-colors"
                    aria-label="Clear date selection"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDate ?? 'all'}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col gap-3 max-h-[580px] overflow-y-auto pr-1"
                >
                  {listEvents.length === 0 ? (
                    <p className="font-sans text-sm text-white/25 text-center py-8">
                      No events this day.
                    </p>
                  ) : (
                    listEvents.map((event) => (
                      <EventListItem
                        key={event.id}
                        event={event}
                        onSelect={() => setPortalEvent(event)}
                      />
                    ))
                  )}
                </motion.div>
              </AnimatePresence>

              {!selectedDate && listEvents.length > 0 && (
                <p className="mt-4 font-sans text-[10px] text-white/20 text-center">
                  Tap a date to filter &middot; Tap an event to explore
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
