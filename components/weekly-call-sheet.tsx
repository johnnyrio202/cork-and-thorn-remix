'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Scissors } from 'lucide-react'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
type DayKey = 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN' | 'MON' | 'TUE'

type CallSheetDay = {
  key:          DayKey
  label:        string
  fullDay:      string
  title:        string
  vibe:         string
  talent:       string
  window:       string
  tableService: boolean
  image:        string
  category:     string
  seat:         string   // "admit one" flavour text
}

const DAYS: CallSheetDay[] = [
  {
    key: 'WED', label: 'WED', fullDay: 'Wednesday',
    title: 'Karaoke Night',
    vibe: 'Electric. Unfiltered. Ours.',
    talent: 'Ali Starr',
    window: '9 PM – 1 AM',
    tableService: false,
    image: '/images/event-live-music.png',
    category: 'Live Performance',
    seat: 'Admit One · Open Seating',
  },
  {
    key: 'THU', label: 'THU', fullDay: 'Thursday',
    title: 'Thursday with Coso',
    vibe: 'Genre-bending. Low light. Movement.',
    talent: 'Coso',
    window: '9 PM – 2 AM',
    tableService: false,
    image: '/images/event-dj-night.png',
    category: 'DJ Set',
    seat: 'Admit One · Open Seating',
  },
  {
    key: 'FRI', label: 'FRI', fullDay: 'Friday',
    title: 'Fresh Fridays',
    vibe: 'Afro-Beats · Neo-Soul · The Standard.',
    talent: 'DJ Tone Arms',
    window: '10 PM – 3 AM',
    tableService: true,
    image: '/images/event-dj-night.png',
    category: 'DJ Set',
    seat: 'Admit One · Table Service Available',
  },
  {
    key: 'SAT', label: 'SAT', fullDay: 'Saturday',
    title: 'Sultry Saturdays',
    vibe: 'Sophisticated Noir. Soulful. Alive.',
    talent: 'Ali Starr & the Alley Cats',
    window: '10 PM – 3 AM',
    tableService: true,
    image: '/images/event-live-music.png',
    category: 'Live Band',
    seat: 'Admit One · Table Service Available',
  },
  {
    key: 'SUN', label: 'SUN', fullDay: 'Sunday',
    title: 'R&B Session Sundays',
    vibe: 'Smooth. Unhurried. The closer.',
    talent: 'Kuntry 702',
    window: '8 PM – 1 AM',
    tableService: false,
    image: '/images/event-live-music.png',
    category: 'R&B Session',
    seat: 'Admit One · Open Seating',
  },
  {
    key: 'MON', label: 'MON', fullDay: 'Monday',
    title: 'Martini Mondays',
    vibe: 'Craft cocktails. Deep cuts. Industry night.',
    talent: 'Industry Underground',
    window: '8 PM – 1 AM',
    tableService: false,
    image: '/images/event-dj-night.png',
    category: 'Industry Night',
    seat: 'Admit One · Open Seating',
  },
  {
    key: 'TUE', label: 'TUE', fullDay: 'Tuesday',
    title: 'Tequila Tuesdays',
    vibe: 'Agave flights. Heat. Good music.',
    talent: 'Industry Underground',
    window: '8 PM – 1 AM',
    tableService: false,
    image: '/images/event-dj-night.png',
    category: 'Industry Night',
    seat: 'Admit One · Open Seating',
  },
]

function getTodayKey(): DayKey {
  const map: DayKey[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  return map[new Date().getDay()]
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface WeeklyCallSheetProps {
  onRSVPClick?:  (day: CallSheetDay) => void
  onTableClick?: (day: CallSheetDay) => void
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function WeeklyCallSheet({ onRSVPClick, onTableClick }: WeeklyCallSheetProps = {}) {
  const [active, setActive] = useState<DayKey>(() => {
    const today = getTodayKey()
    return DAYS.find(d => d.key === today) ? today : 'FRI'
  })
  const [isVIPMember, setIsVIPMember] = useState(false)
  const [flyerDay, setFlyerDay]       = useState<CallSheetDay | null>(null)

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-20">

      {/* ── Cinema marquee header ────────────────────────────────────────── */}
      <div className="relative mb-10 text-center">
        {/* top rule */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <span className="font-sans text-[9px] uppercase tracking-[0.6em] text-primary/60">
            Now Playing All Week
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        {/* marquee bulbs */}
        <div className="flex justify-center gap-3 mb-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.14, ease: 'easeInOut' }}
              className="w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_rgba(226,182,54,0.6)]"
            />
          ))}
        </div>

        <h2 className="font-serif text-5xl sm:text-6xl text-[#F5ECD2] tracking-tight">
          The Weekly Lineup
        </h2>
        <p className="mt-3 font-sans text-xs uppercase tracking-[0.4em] text-white/35">
          Cork &amp; Thorn &nbsp;&middot;&nbsp; Las Vegas
        </p>
      </div>

      {/* ── VIP toggle ───────────────────────────────────────────────────── */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsVIPMember(v => !v)}
          className={[
            'inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-widest border transition-all duration-300',
            isVIPMember
              ? 'bg-primary/15 border-primary/50 text-primary shadow-[0_0_16px_rgba(226,182,54,0.25)]'
              : 'bg-white/[0.04] border-white/10 text-white/35',
          ].join(' ')}
        >
          <Zap className={`w-3 h-3 ${isVIPMember ? 'text-primary' : 'text-white/20'}`} />
          {isVIPMember ? 'VIP Member' : 'Non-Member'}
        </button>
      </div>

      {/* ── Ticket stack ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        {DAYS.map((day, i) => (
          <TicketRow
            key={day.key}
            day={day}
            index={i}
            isActive={active === day.key}
            isVIPMember={isVIPMember}
            onSelect={() => setActive(day.key)}
            onFlyer={() => setFlyerDay(day)}
            onRSVP={() => onRSVPClick?.(day)}
            onTable={() => onTableClick?.(day)}
          />
        ))}
      </div>

      {/* ── Movie poster lightbox ─────────────────────────────────────────── */}
      <AnimatePresence>
        {flyerDay && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setFlyerDay(null)}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-sm w-full rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(226,182,54,0.25)] border border-primary/20"
            >
              <img
                src={flyerDay.image}
                alt={flyerDay.title}
                className="w-full aspect-[2/3] object-cover"
              />
              {/* poster overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B111B] via-[#0B111B]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-sans text-[9px] uppercase tracking-[0.5em] text-primary/70 mb-1">{flyerDay.category}</p>
                <h3 className="font-serif text-3xl text-[#F5ECD2]">{flyerDay.title}</h3>
                <p className="font-sans text-sm text-white/55 mt-1">{flyerDay.talent}</p>
                <p className="font-sans text-xs text-primary mt-2">{flyerDay.window}</p>
              </div>
              <button
                onClick={() => setFlyerDay(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white/60 hover:text-white transition-colors text-lg leading-none"
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TicketRow — the physical ticket
// ---------------------------------------------------------------------------
interface TicketRowProps {
  day:          CallSheetDay
  index:        number
  isActive:     boolean
  isVIPMember:  boolean
  onSelect:     () => void
  onFlyer:      () => void
  onRSVP:       () => void
  onTable:      () => void
}

function TicketRow({ day, index, isActive, isVIPMember, onSelect, onFlyer, onRSVP, onTable }: TicketRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onClick={onSelect}
      className="group cursor-pointer"
    >
      {/* Ticket body */}
      <div
        className={[
          'relative flex rounded-xl overflow-hidden transition-all duration-300',
          'border',
          isActive
            ? 'border-primary/40 shadow-[0_0_36px_rgba(226,182,54,0.18)]'
            : 'border-white/[0.07] hover:border-white/[0.14]',
        ].join(' ')}
      >

        {/* ── LEFT: Cinematic flyer thumbnail ───────────────────────── */}
        <button
          onClick={e => { e.stopPropagation(); onFlyer() }}
          className="relative w-28 sm:w-36 flex-shrink-0 overflow-hidden group/flyer"
          aria-label={`View ${day.title} flyer`}
        >
          <img
            src={day.image}
            alt={day.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/flyer:scale-110"
          />
          {/* dark wash */}
          <div className="absolute inset-0 bg-[#0B111B]/50 group-hover/flyer:bg-[#0B111B]/30 transition-colors duration-300" />
          {/* play hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/flyer:opacity-100 transition-opacity duration-200">
            <span className="w-9 h-9 rounded-full border border-primary/70 bg-primary/20 backdrop-blur flex items-center justify-center">
              <svg className="w-4 h-4 text-primary ml-0.5" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5 3.5l9 4.5-9 4.5V3.5z" />
              </svg>
            </span>
          </div>
          {/* category tag */}
          <span className="absolute bottom-2 left-2 font-sans text-[8px] uppercase tracking-widest text-primary/90 bg-[#0B111B]/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-primary/20">
            {day.category}
          </span>
        </button>

        {/* ── CENTER: Editorial ticket body ─────────────────────────── */}
        <div className={[
          'flex-1 px-5 py-5 flex flex-col justify-between',
          isActive ? 'bg-white/[0.04]' : 'bg-[#0B111B]/60',
        ].join(' ')}>

          {/* Top: day + title */}
          <div>
            <p className={[
              'font-sans text-[9px] uppercase tracking-[0.5em] mb-1.5 transition-colors',
              isActive ? 'text-primary/80' : 'text-white/30',
            ].join(' ')}>
              {day.fullDay}
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#F5ECD2] leading-tight">
              {day.title}
            </h3>
            <p className="font-sans text-sm text-white/45 mt-1">{day.talent}</p>
          </div>

          {/* Bottom: vibe + time */}
          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <p className="font-sans text-xs text-white/30 italic leading-snug max-w-[260px]">
              &ldquo;{day.vibe}&rdquo;
            </p>
            <span className={[
              'font-sans text-[10px] font-semibold uppercase tracking-[0.3em] transition-colors',
              isActive ? 'text-primary' : 'text-white/30',
            ].join(' ')}>
              {day.window}
            </span>
          </div>
        </div>

        {/* ── PERFORATION ───────────────────────────────────────────── */}
        <div className="relative flex-shrink-0 w-px flex flex-col items-center justify-between py-4">
          {/* dashed line */}
          <div className="absolute inset-y-0 left-0 w-px border-l border-dashed border-white/10" />
          {/* top notch */}
          <span className="relative -left-3 w-6 h-6 rounded-full bg-[#0B111B] border border-white/[0.07] z-10" />
          {/* scissors icon */}
          <span className="relative -left-2.5 text-white/15">
            <Scissors className="w-3.5 h-3.5 -rotate-90" />
          </span>
          {/* bottom notch */}
          <span className="relative -left-3 w-6 h-6 rounded-full bg-[#0B111B] border border-white/[0.07] z-10" />
        </div>

        {/* ── RIGHT: Tear-off stub ───────────────────────────────────── */}
        <div className={[
          'flex-shrink-0 w-28 sm:w-36 flex flex-col items-center justify-center gap-4 px-3 py-5',
          isActive ? 'bg-primary/[0.06]' : 'bg-white/[0.025]',
        ].join(' ')}>

          {/* Stub header */}
          <div className="text-center">
            <p className="font-sans text-[8px] uppercase tracking-[0.4em] text-white/25 mb-0.5">
              Admit One
            </p>
            <p className={[
              'font-sans text-[9px] font-semibold uppercase tracking-widest',
              isActive ? 'text-primary/70' : 'text-white/20',
            ].join(' ')}>
              {day.tableService ? 'VIP Available' : 'Open Seating'}
            </p>
          </div>

          {/* Barcode lines */}
          <div className="flex gap-[2px] items-end h-8">
            {[3,5,2,6,4,3,5,2,4,3,6,2,4,5,3].map((h, i) => (
              <span
                key={i}
                className={[
                  'w-[2px] rounded-sm transition-colors',
                  isActive ? 'bg-primary/40' : 'bg-white/15',
                ].join(' ')}
                style={{ height: `${h * 4}px` }}
              />
            ))}
          </div>

          {/* RSVP action */}
          <motion.button
            onClick={e => { e.stopPropagation(); onRSVP() }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className={[
              'w-full rounded-lg py-2.5 font-sans text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-200',
              isActive
                ? 'border border-primary/50 bg-primary/10 text-primary hover:bg-primary/20'
                : 'border border-white/10 bg-white/[0.04] text-white/30 hover:border-white/20 hover:text-white/50',
            ].join(' ')}
          >
            RSVP
          </motion.button>

          {/* Table service button — Fri & Sat only */}
          {day.tableService && (
            isVIPMember ? (
              <motion.button
                onClick={e => { e.stopPropagation(); onTable() }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 0 12px rgba(226,182,54,0.3)',
                    '0 0 28px rgba(226,182,54,0.6)',
                    '0 0 12px rgba(226,182,54,0.3)',
                  ],
                }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full rounded-lg bg-primary py-2.5 font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-[#0B111B] flex items-center justify-center gap-1"
              >
                <Zap className="w-3 h-3" />
                Secure Table
              </motion.button>
            ) : (
              <button
                disabled
                className="w-full rounded-lg border border-white/[0.07] bg-white/[0.025] py-2.5 font-sans text-[9px] uppercase tracking-[0.1em] text-white/20 cursor-not-allowed"
              >
                Table Service
              </button>
            )
          )}
        </div>
      </div>
    </motion.div>
  )
}
