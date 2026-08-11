'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, MapPin, Users, Phone, CheckCircle } from 'lucide-react'
import dynamic from 'next/dynamic'
// Disable SSR for the calendar carousel — it renders date numbers from
// `new Date()` which differ between the UTC server and the client's local
// timezone, causing persistent hydration mismatches.
const WeeklyCalendarCarousel = dynamic(
  () => import('@/components/weekly-calendar-carousel').then(m => m.WeeklyCalendarCarousel),
  { ssr: false }
)

// ---------------------------------------------------------------------------
// Weekly event data — Wed–Sun only (Mon/Tue are covered separately)
// ---------------------------------------------------------------------------
const WEEKLY_EVENTS = [
  {
    day: 'MON', fullDay: 'Monday',
    title: 'Martini Mondays',
    talent: 'Industry Underground',
    time: '9 PM – 2 AM',
    tag: 'Industry Night',
    tableService: false,
  },
  {
    day: 'TUE', fullDay: 'Tuesday',
    title: 'Tequila Tuesdays',
    talent: 'Industry Underground',
    time: '9 PM – 2 AM',
    tag: 'Industry Night',
    tableService: false,
  },
  {
    day: 'WED', fullDay: 'Wednesday',
    title: 'Karaoke Night',
    talent: 'Ali Starr',
    time: '9 PM – 1 AM',
    tag: 'Karaoke',
    tableService: false,
  },
  {
    day: 'THU', fullDay: 'Thursday',
    title: 'Thursday with Coso',
    talent: 'Coso',
    time: '9 PM – 2 AM',
    tag: 'DJ Set',
    tableService: false,
  },
  {
    day: 'FRI', fullDay: 'Friday',
    title: 'Fresh Friday',
    talent: 'DJ Tone Arms',
    time: '10 PM – 3 AM',
    tag: 'DJ Set',
    tableService: true,
  },
  {
    day: 'SAT', fullDay: 'Saturday',
    title: 'Sultry Saturday',
    talent: 'Ali Starr & the Alley Cats',
    time: '10 PM – 3 AM',
    tag: 'Live Music',
    tableService: true,
  },
  {
    day: 'SUN', fullDay: 'Sunday',
    title: 'R&B Session Sundays',
    talent: 'Kuntry 702',
    time: '8 PM – 1 AM',
    tag: 'Live R&B',
    tableService: false,
  },
]

// ---------------------------------------------------------------------------
// Table / floor plan data
// ---------------------------------------------------------------------------
type BoothStatus = 'available' | 'reserved'

const TABLES: {
  id: string; label: string; minSpend: string; section: string; capacity: string; status: BoothStatus
}[] = [
  // ── Stage row ──
  { id: 'stage-vip',    label: 'Stage VIP',    minSpend: '$2,000 Min', section: 'Stage',  capacity: '4–12', status: 'available' },
  { id: 'dj-vip',       label: 'DJ VIP',       minSpend: '$500 Min',   section: 'Stage',  capacity: '2–4',  status: 'available' },
  // ── Back / rear-right ──
  { id: 'back-back-vip',label: 'Back Back VIP',minSpend: '$2,500 Min', section: 'Back',   capacity: '8–20', status: 'reserved'  },
  { id: 'teremana-vip', label: 'Teremana VIP', minSpend: '$2,000 Min', section: 'Back',   capacity: '8–12', status: 'available' },
  // ── Lounge ──
  { id: 'flower-couch', label: 'Flower Couch', minSpend: '$1,000 Min', section: 'Lounge', capacity: '4–8',  status: 'reserved'  },
  // ── Center ──
  { id: 'center-1-vip', label: 'Center 1 VIP', minSpend: '$1,000 Min', section: 'Center', capacity: '4–6',  status: 'available' },
  { id: 'center-2-vip', label: 'Center 2 VIP', minSpend: '$1,000 Min', section: 'Center', capacity: '4–6',  status: 'available' },
  { id: 'b-center-1',   label: 'B Center 1 VIP', minSpend: '$500 Min', section: 'Center', capacity: '2–4',  status: 'available' },
  { id: 'b-center-2',   label: 'B Center 2 VIP', minSpend: '$500 Min', section: 'Center', capacity: '2–4',  status: 'available' },
  // ── Gold ──
  { id: 'gold-1-vip',   label: 'Gold 1 VIP',   minSpend: '$1,000 Min', section: 'Gold',   capacity: '4–8',  status: 'available' },
  { id: 'gold-2-vip',   label: 'Gold 2 VIP',   minSpend: '$1,000 Min', section: 'Gold',   capacity: '4–8',  status: 'reserved'  },
  { id: 'gold-3-vip',   label: 'Gold 3 VIP',   minSpend: '$1,000 Min', section: 'Gold',   capacity: '4–8',  status: 'reserved'  },
  { id: 'randi-vip',    label: 'Randi VIP',    minSpend: '$500 Min',   section: 'Gold',   capacity: '2–4',  status: 'reserved'  },
  // ── Circle ──
  { id: 'circle-1-vip', label: 'Circle 1 VIP', minSpend: '$500 Min',   section: 'Circle', capacity: '2–4',  status: 'available' },
  { id: 'circle-2-vip', label: 'Circle 2 VIP', minSpend: '$500 Min',   section: 'Circle', capacity: '2–4',  status: 'available' },
  { id: 'circle-4-vip', label: 'Circle 4 VIP', minSpend: '$500 Min',   section: 'Circle', capacity: '2–4',  status: 'available' },
  // ── Right wall ──
  { id: 'side-vip',     label: 'Side VIP',     minSpend: '$1,000 Min', section: 'Side',   capacity: '4–8',  status: 'available' },
  { id: 'flower-vip',   label: 'Flower VIP',   minSpend: '$1,500 Min', section: 'Side',   capacity: '4–12', status: 'available' },
  { id: 'bellaire-vip', label: 'Bellaire VIP', minSpend: '$500 Min',   section: 'Side',   capacity: '2–6',  status: 'available' },
  // ── Floor / front ──
  { id: 'brian-vip',    label: 'Brian VIP',    minSpend: '$500 Min',   section: 'Floor',  capacity: '2–4',  status: 'available' },
  { id: 'blue-1-vip',   label: 'Blue 1 VIP',   minSpend: '$2,000 Min', section: 'Blue',   capacity: '8–12', status: 'available' },
  { id: 'blue-2-vip',   label: 'Blue 2 VIP',   minSpend: '$2,500 Min', section: 'Blue',   capacity: '8–20', status: 'available' },
]

function getTodayIndex() {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

// ---------------------------------------------------------------------------
// Auth-Gate Modal
// ---------------------------------------------------------------------------
type AuthState = 'phone' | 'otp' | 'confirmed'

function AuthGate({ event, onClose }: { event: typeof WEEKLY_EVENTS[0]; onClose: () => void }) {
  const [authState, setAuthState] = useState<AuthState>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp]     = useState(['', '', '', ''])
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const handleOtpChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[idx] = val
    setOtp(next)
    if (val && idx < 3) inputRefs[idx + 1].current?.focus()
  }

  const handleVerify = () => {
    if (otp.join('').length === 4) setAuthState('confirmed')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B111B]/90 backdrop-blur-xl px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        onClick={e => e.stopPropagation()}
        className={[
          'relative w-full max-w-md rounded-2xl border p-8 md:p-10',
          authState === 'confirmed'
            ? 'border-[#00FFFF]/60 shadow-[0_0_60px_rgba(0,255,255,0.25)] bg-[#0B111B]'
            : 'border-[#C4966A]/20 shadow-[0_0_60px_rgba(196,150,106,0.15)] bg-white/[0.04] backdrop-blur-2xl',
        ].join(' ')}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#C4966A]/70 mb-1">
          {event.fullDay} — {event.time}
        </p>
        <h3 className="font-sans text-2xl text-white mb-1">{event.title}</h3>
        <p className="font-sans text-sm text-white/50 mb-8">{event.talent}</p>

        <p className="font-sans text-lg font-semibold text-white mb-6">Inner Circle Verification</p>

        <AnimatePresence mode="wait">
          {authState === 'phone' && (
            <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <label className="block font-sans text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                Phone Number
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 mb-4 focus-within:border-[#E2B636]/50 transition-colors">
                <Phone className="w-4 h-4 text-white/30 shrink-0" />
                <input
                  type="tel"
                  placeholder="+1 (702) 000-0000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="flex-1 bg-transparent font-sans text-sm text-white placeholder:text-white/20 outline-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { if (phone.length >= 10) setAuthState('otp') }}
                className="w-full rounded-xl bg-primary py-3.5 font-sans text-sm font-bold uppercase tracking-[0.2em] text-black shadow-[0_0_30px_rgba(226,182,54,0.4)] hover:shadow-[0_0_45px_rgba(226,182,54,0.6)] transition-shadow"
              >
                Request Access
              </motion.button>
            </motion.div>
          )}

          {authState === 'otp' && (
            <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <p className="font-sans text-xs text-white/40 mb-4">Enter the 4-digit code sent to {phone}</p>
              <div className="flex items-center justify-center gap-3 mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={inputRefs[i]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    className="h-14 w-14 rounded-xl border border-white/10 bg-white/[0.04] text-center font-sans text-2xl text-white outline-none focus:border-[#E2B636]/60 transition-colors"
                  />
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleVerify}
                className="w-full rounded-xl bg-primary py-3.5 font-sans text-sm font-bold uppercase tracking-[0.2em] text-black shadow-[0_0_30px_rgba(226,182,54,0.4)] hover:shadow-[0_0_45px_rgba(226,182,54,0.6)] transition-shadow"
              >
                Verify &amp; Lock In
              </motion.button>
            </motion.div>
          )}

          {authState === 'confirmed' && (
            <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} className="text-center py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#00FFFF]/50 bg-[#00FFFF]/10 shadow-[0_0_40px_rgba(0,255,255,0.4)]"
              >
                <CheckCircle className="w-8 h-8 text-[#00FFFF]" />
              </motion.div>
              <p className="font-sans text-lg font-semibold text-[#00FFFF] mb-2">Welcome to the Inner Circle.</p>
              <p className="font-sans text-sm text-white/50">RSVP Locked.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Floor plan SVG — mapped 1:1 from the B-Side "VIP Beam Sundays" floor plan.
// Top = STAGE / front of house · Bottom = ENTRANCE · Green = available,
// Amber = reserved (reserved booths are not selectable).
// ---------------------------------------------------------------------------
const AVAIL = { fill: 'rgba(52,211,153,0.12)', stroke: 'rgba(52,211,153,0.55)', glow: '#34D399' }
const RESV  = { fill: 'rgba(226,182,54,0.13)', stroke: 'rgba(226,182,54,0.6)',  glow: '#E2B636' }

function FloorPlan({ onSelect, selected }: {
  onSelect: (id: string) => void
  selected: string | null
}) {
  const statusOf = (id: string): BoothStatus =>
    TABLES.find(t => t.id === id)?.status ?? 'available'

  const W = 1000
  const H = 720

  // Shared style resolver
  const style = (id: string) => {
    const reserved = statusOf(id) === 'reserved'
    const c = reserved ? RESV : AVAIL
    const sel = selected === id
    return {
      fill: sel ? 'rgba(52,211,153,0.3)' : c.fill,
      stroke: sel ? c.glow : c.stroke,
      strokeWidth: sel ? 2.5 : 1.5,
      text: reserved ? 'rgba(226,182,54,0.9)' : 'rgba(255,255,255,0.82)',
      css: {
        filter: sel ? `drop-shadow(0 0 12px ${c.glow})` : 'none',
        cursor: reserved ? 'not-allowed' : 'pointer',
        transition: 'all 0.18s',
      } as React.CSSProperties,
      onClick: reserved ? undefined : () => onSelect(id),
      reserved,
    }
  }

  // Rectangular booth with name + capacity stacked inside
  const Booth = ({ id, x, y, w, h, rx = 8 }: {
    id: string; x: number; y: number; w: number; h: number; rx?: number
  }) => {
    const t = TABLES.find(b => b.id === id)!
    const s = style(id)
    const cx = x + w / 2
    const cy = y + h / 2
    return (
      <g style={s.css} onClick={s.onClick} role="button" aria-label={t.label}>
        <rect x={x} y={y} width={w} height={h} rx={rx}
          fill={s.fill} stroke={s.stroke} strokeWidth={s.strokeWidth} />
        <text x={cx} y={cy - 3} textAnchor="middle" fill={s.text}
          fontSize="15" fontFamily="sans-serif" fontWeight="700">{t.label}</text>
        <text x={cx} y={cy + 15} textAnchor="middle" fill="rgba(255,255,255,0.4)"
          fontSize="12" fontFamily="sans-serif">{t.capacity} ppl</text>
      </g>
    )
  }

  // Round booth
  const Round = ({ id, cx, cy, r }: { id: string; cx: number; cy: number; r: number }) => {
    const t = TABLES.find(b => b.id === id)!
    const s = style(id)
    return (
      <g style={s.css} onClick={s.onClick} role="button" aria-label={t.label}>
        <circle cx={cx} cy={cy} r={r} fill={s.fill} stroke={s.stroke} strokeWidth={s.strokeWidth} />
        <text x={cx} y={cy - 2} textAnchor="middle" fill={s.text}
          fontSize="12" fontFamily="sans-serif" fontWeight="700">{t.label.replace(' VIP', '')}</text>
        <text x={cx} y={cy + 13} textAnchor="middle" fill="rgba(255,255,255,0.4)"
          fontSize="10" fontFamily="sans-serif">{t.capacity}</text>
      </g>
    )
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" aria-label="VIP Beam Sundays floor plan">
      {/* Room */}
      <rect width={W} height={H} fill="#0a1018" rx="16" />
      <rect x="30" y="24" width={W - 60} height={H - 96} rx="10"
        fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5" />

      {/* ── STAGE ───────────────────────────────────────── */}
      <Booth id="stage-vip" x={300} y={44} w={130} h={72} />
      <rect x={438} y={44} width={230} height={72} rx="8"
        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
      <text x={553} y={90} textAnchor="middle" fill="#fff"
        fontSize="30" fontFamily="sans-serif" fontWeight="800" letterSpacing="3">STAGE</text>

      {/* DJ VIP */}
      <Booth id="dj-vip" x={700} y={44} w={100} h={62} />

      {/* Back Back VIP + Teremana (rear-right) */}
      <Booth id="back-back-vip" x={830} y={44} w={140} h={92} />
      <Booth id="teremana-vip"  x={830} y={150} w={140} h={54} />

      {/* ── Flower Couch — C-shaped lounge (top-left) ───── */}
      {(() => {
        const s = style('flower-couch')
        return (
          <g style={s.css} onClick={s.onClick} role="button" aria-label="Flower Couch">
            <path d="M 246 112 A 58 58 0 1 0 246 228" fill="none"
              stroke={s.stroke} strokeWidth="26" strokeLinecap="round"
              style={{ filter: s.css.filter }} />
            <text x={150} y={166} textAnchor="middle" fill={s.text}
              fontSize="14" fontFamily="sans-serif" fontWeight="700">Flower</text>
            <text x={150} y={184} textAnchor="middle" fill={s.text}
              fontSize="14" fontFamily="sans-serif" fontWeight="700">Couch</text>
            <text x={150} y={202} textAnchor="middle" fill="rgba(255,255,255,0.4)"
              fontSize="11" fontFamily="sans-serif">4–8 ppl</text>
          </g>
        )
      })()}

      {/* ── Booth 1 (Gold 1 VIP — L shape) ──────────────── */}
      <Booth id="gold-1-vip" x={286} y={300} w={40} h={150} rx={6} />
      <rect x={286} y={430} width={130} height={38} rx="6"
        fill={style('gold-1-vip').fill} stroke={style('gold-1-vip').stroke} strokeWidth={style('gold-1-vip').strokeWidth}
        style={style('gold-1-vip').css} onClick={style('gold-1-vip').onClick} />

      {/* ── Center 1 & 2 VIP ────────────────────────────── */}
      <Booth id="center-1-vip" x={400} y={250} w={120} h={44} />
      <Booth id="center-2-vip" x={528} y={250} w={120} h={44} />

      {/* ── B Center 1 & 2 (trapezoid-ish) ──────────────── */}
      <Booth id="b-center-1" x={400} y={300} w={120} h={46} rx={4} />
      <Booth id="b-center-2" x={528} y={300} w={120} h={46} rx={4} />

      {/* ── Gold 2 VIP (booth 8, tall) ──────────────────── */}
      <Booth id="gold-2-vip" x={672} y={150} w={70} h={150} />

      {/* ── Gold 3 VIP (booth 3) + Randi VIP (booth 10) ─── */}
      <Booth id="gold-3-vip" x={620} y={430} w={110} h={40} />
      <Booth id="randi-vip"  x={700} y={320} w={44} h={130} />

      {/* ── Circle 4 VIP (round, mid-right) ─────────────── */}
      <Round id="circle-4-vip" cx={790} cy={410} r={28} />

      {/* ── Right wall — Side VIP · Flower VIP ──────────── */}
      <Booth id="side-vip"   x={840} y={250} w={130} h={44} />
      <Booth id="flower-vip" x={840} y={420} w={130} h={70} />

      {/* ── Bellaire VIP (round) ────────────────────────── */}
      <Round id="bellaire-vip" cx={780} cy={540} r={32} />

      {/* ── Circle 1 & 2 VIP (round, front) ─────────────── */}
      <Round id="circle-1-vip" cx={330} cy={540} r={34} />
      <Round id="circle-2-vip" cx={438} cy={540} r={34} />

      {/* ── Brian VIP ───────────────────────────────────── */}
      <Booth id="brian-vip" x={540} y={510} w={92} h={44} />

      {/* ── Blue 1 & 2 VIP — U shape ────────────────────── */}
      <Booth id="blue-1-vip" x={452} y={578} w={70} h={78} rx={6} />
      <Booth id="blue-2-vip" x={590} y={578} w={70} h={78} rx={6} />
      <rect x={452} y={628} width={208} height={30} rx="6"
        fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {/* ── HOOKAH ──────────────────────────────────────── */}
      <rect x={720} y={588} width={220} height={54} rx="8"
        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
      <text x={830} y={622} textAnchor="middle" fill="#fff"
        fontSize="22" fontFamily="sans-serif" fontWeight="800" letterSpacing="2">HOOKAH</text>

      {/* ── ENTRANCE / EXIT ─────────────────────────────── */}
      <text x={330} y={H - 20} textAnchor="middle" fill="rgba(255,255,255,0.55)"
        fontSize="18" fontFamily="sans-serif" fontWeight="700" letterSpacing="2">ENTRANCE</text>
      <text x={210} y={H - 58} textAnchor="middle" fill="rgba(255,255,255,0.3)"
        fontSize="12" fontFamily="sans-serif" letterSpacing="1">◄ Exit</text>
      <text x={490} y={H - 24} textAnchor="middle" fill="rgba(255,255,255,0.3)"
        fontSize="12" fontFamily="sans-serif" letterSpacing="1">◄ Exit</text>

      {/* ── Legend ──────────────────────────────────────── */}
      <rect x={760} y={H - 66} width={22} height={14} rx="3" fill={AVAIL.fill} stroke={AVAIL.stroke} strokeWidth="1.5" />
      <text x={790} y={H - 55} fill="rgba(255,255,255,0.6)" fontSize="12" fontFamily="sans-serif">Available</text>
      <rect x={760} y={H - 44} width={22} height={14} rx="3" fill={RESV.fill} stroke={RESV.stroke} strokeWidth="1.5" />
      <text x={790} y={H - 33} fill="rgba(255,255,255,0.6)" fontSize="12" fontFamily="sans-serif">Reserved</text>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Table drawer
// ---------------------------------------------------------------------------
type DrawerState = 'info' | 'form'

function TableDrawer({ tableId, onClose }: { tableId: string; onClose: () => void }) {
  const table = TABLES.find(t => t.id === tableId)!
  const [drawerState, setDrawerState] = useState<DrawerState>('info')
  const [formData, setFormData] = useState({ name: '', phone: '', partySize: 4 })
  const [submitted, setSubmitted] = useState(false)

  const flipVariants = {
    info:   { rotateY: 0,    opacity: 1 },
    form:   { rotateY: 0,    opacity: 1 },
    exitInfo: { rotateY: -90, opacity: 0 },
    enterForm: { rotateY: 90, opacity: 0 },
  }

  if (!table) return null

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 26 }}
      className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-white/[0.06]">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-primary/70 mb-1">{table.section}</p>
          <h4 className="font-sans text-xl text-white">{table.label}</h4>
          <p className="font-sans text-sm text-primary font-semibold mt-1">{table.minSpend}</p>
        </div>
        <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors mt-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {drawerState === 'info' && !submitted && (
            <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
              {/* POV placeholder */}
              <div className="relative w-full rounded-xl overflow-hidden mb-5" style={{ aspectRatio: '16/9' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent flex flex-col items-center justify-center border border-white/10 rounded-xl"
                  style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)' }}>
                  <MapPin className="w-8 h-8 text-primary/40 mb-2" />
                  <p className="font-sans text-xs uppercase tracking-[0.2em] text-white/30">POV: View From Table</p>
                </div>
              </div>

                <div className="space-y-2 mb-6 text-sm text-white/50 font-sans">
                <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <span>Section</span>
                  <span className="text-white/80">{table.section}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <span>Capacity</span>
                  <span className="text-white/80">{table.capacity} guests</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <span>Minimum Spend</span>
                  <span className="text-primary font-semibold">{table.minSpend}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setDrawerState('form')}
                className="w-full rounded-xl bg-primary py-3.5 font-sans text-sm font-bold uppercase tracking-[0.2em] text-black shadow-[0_0_30px_rgba(226,182,54,0.4)] hover:shadow-[0_0_45px_rgba(226,182,54,0.6)] transition-shadow"
              >
                Lock In Reservation
              </motion.button>
            </motion.div>
          )}

          {drawerState === 'form' && !submitted && (
            <motion.div key="form" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <p className="font-sans text-sm text-white/40 mb-5">Complete your reservation for <span className="text-white">{table.label}</span></p>

              <div className="space-y-4 mb-6">
                {[
                  { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
                  { label: 'Phone',     key: 'phone', type: 'tel',  placeholder: '+1 (702) 000-0000' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block font-sans text-xs uppercase tracking-[0.2em] text-white/40 mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.key as 'name' | 'phone']}
                      onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-sans text-sm text-white placeholder:text-white/20 outline-none focus:border-[#E2B636]/50 transition-colors"
                    />
                  </div>
                ))}

                {/* Party size slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-sans text-xs uppercase tracking-[0.2em] text-white/40">Party Size</label>
                    <span className="font-sans text-sm font-semibold text-primary flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {formData.partySize}
                    </span>
                  </div>
                  <input
                    type="range" min={1} max={12} step={1}
                    value={formData.partySize}
                    onChange={e => setFormData(p => ({ ...p, partySize: Number(e.target.value) }))}
                    className="w-full accent-[#E2B636]"
                  />
                  <div className="flex justify-between font-sans text-[10px] text-white/20 mt-1">
                    <span>1</span><span>12</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSubmitted(true)}
                className="w-full rounded-xl bg-primary py-3.5 font-sans text-sm font-bold uppercase tracking-[0.2em] text-black shadow-[0_0_30px_rgba(226,182,54,0.4)] hover:shadow-[0_0_45px_rgba(226,182,54,0.6)] transition-shadow"
              >
                Confirm Reservation
              </motion.button>
            </motion.div>
          )}

          {submitted && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#00FFFF]/50 bg-[#00FFFF]/10 shadow-[0_0_40px_rgba(0,255,255,0.4)]"
              >
                <CheckCircle className="w-8 h-8 text-[#00FFFF]" />
              </motion.div>
              <p className="font-sans text-base font-semibold text-[#00FFFF] mb-1">{table.label} Reserved</p>
              <p className="font-sans text-sm text-white/40">We&apos;ll confirm with you shortly.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Flyer Rotator — crossfades through event poster images
// ---------------------------------------------------------------------------

const FLYERS = [
  { src: '/images/event-dj-night.png',   alt: 'DJ Night at Cork & Thorn' },
  { src: '/images/event-live-music.png', alt: 'Live Music at Cork & Thorn' },
  { src: '/images/event-hookah.png',     alt: 'Hookah Lounge Night' },
]

function FlyerRotator() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent(c => (c + 1) % FLYERS.length)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.6)] aspect-[3/4] lg:aspect-auto lg:h-full min-h-[340px]">
      <AnimatePresence mode="sync">
        <motion.img
          key={current}
          src={FLYERS[current].src}
          alt={FLYERS[current].alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B111B]/70 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
        {FLYERS.map((_, i) => (
          <span
            key={i}
            className={[
              'block rounded-full transition-all duration-500',
              i === current
                ? 'w-5 h-1.5 bg-primary shadow-[0_0_8px_rgba(226,182,54,0.7)]'
                : 'w-1.5 h-1.5 bg-white/25',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
type Phase = 'calendar' | 'map'

export function ExperiencesSection() {
  const [phase, setPhase]             = useState<Phase>('calendar')
  const [authEvent, setAuthEvent]     = useState<typeof WEEKLY_EVENTS[0] | null>(null)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)


  return (
    <section className="relative w-full bg-[#0B111B] px-6 pt-[58px] pb-[75px]">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.35em] text-primary/80 mb-4">
            The Experiences
          </p>
          <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl text-white">Live &amp; In The Room</h2>
        </div>

        <AnimatePresence mode="wait">

          {/* ----------------------------------------------------------------
            PHASE 1 — Calendar + Bottle Service add-on strip
          ---------------------------------------------------------------- */}
          {phase === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-16"
            >
              {/* Weekly lineup carousel */}
              <WeeklyCalendarCarousel
                onTableClick={() => { setPhase('map'); setSelectedTable(null) }}
              />

              {/* ── Add to the Experience ── */}
              <div className="relative">
                {/* Divider */}
                <div className="flex items-center gap-4 mb-10">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <p className="font-sans text-[10px] uppercase tracking-[0.38em] text-primary/60 shrink-0">
                    Add to the Experience
                  </p>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </div>

                {/* Content row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">

                  {/* Left — copy */}
                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-primary/60 mb-2">
                        VIP Group Bottle Service
                      </p>
                      <h3 className="font-sans text-3xl sm:text-4xl text-white leading-tight">
                        RSVP<br />Bottle Service
                      </h3>
                    </div>

                    <p className="font-sans text-sm text-white/45 leading-relaxed">
                      Reserve your section before the night fills up. Premium bottle packages, dedicated service, and the best view in the room — available every Friday and Saturday after 11 PM.
                    </p>

                    {/* Availability badge */}
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        {['FRI', 'SAT'].map(d => (
                          <span
                            key={d}
                            className="rounded-lg border border-primary/40 bg-primary/[0.08] px-3 py-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-primary"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                      <span className="font-sans text-[11px] text-white/30 uppercase tracking-[0.15em]">After 11 PM only</span>
                    </div>

                    {/* Tiers */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Lounge',         spend: '$500 Min' },
                        { label: 'Dancefloor VIP', spend: '$1,200 Min' },
                        { label: 'Stage Booth',    spend: '$2,000 Min' },
                      ].map(tier => (
                        <div
                          key={tier.label}
                          className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-3 text-center"
                        >
                          <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-white/30 mb-1">{tier.label}</p>
                          <p className="font-sans text-sm font-bold text-primary">{tier.spend}</p>
                        </div>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(226,182,54,0.55)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setPhase('map'); setSelectedTable(null) }}
                      className="w-full rounded-xl bg-primary py-4 font-sans text-sm font-bold uppercase tracking-[0.28em] text-black"
                      style={{ boxShadow: '0 0 24px rgba(226,182,54,0.35)' }}
                    >
                      Select Your Table
                    </motion.button>
                  </div>

                  {/* Right — floor plan preview */}
                  <motion.div
                    className="relative rounded-2xl overflow-hidden border border-white/[0.08] cursor-pointer"
                    style={{ aspectRatio: '4/3', boxShadow: '0 24px 60px rgba(0,0,0,0.55)' }}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => { setPhase('map'); setSelectedTable(null) }}
                  >
                    <div className="absolute inset-0 bg-[#0a0f18]">
                      <FloorPlan onSelect={() => { setPhase('map'); setSelectedTable(null) }} selected={null} />
                    </div>
                    {/* Overlay prompt */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors">
                      <div className="text-center">
                        <div
                          className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-primary/50 bg-primary/10"
                          style={{ boxShadow: '0 0 24px rgba(226,182,54,0.30)' }}
                        >
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <p className="font-sans text-xs uppercase tracking-[0.25em] text-white/70">Tap to explore</p>
                      </div>
                    </div>
                  </motion.div>

                </div>
              </div>

            </motion.div>
          )}

          {/* ----------------------------------------------------------------
            PHASE 3 — Spatial map
          ---------------------------------------------------------------- */}
          {phase === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-5"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setPhase('calendar'); setSelectedTable(null) }}
                  className="flex items-center gap-2 font-sans text-sm text-white/40 hover:text-white/70 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Events
                </button>
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-primary/60">Select Your Table</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
                {/* Floor plan */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 overflow-hidden">
                  <FloorPlan onSelect={setSelectedTable} selected={selectedTable} />
                </div>

                {/* Drawer */}
                <div className="min-h-[420px]">
                  <AnimatePresence mode="wait">
                    {selectedTable ? (
                      <TableDrawer
                        key={selectedTable}
                        tableId={selectedTable}
                        onClose={() => setSelectedTable(null)}
                      />
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-8 text-center"
                      >
                        <MapPin className="w-8 h-8 text-primary/30 mb-3" />
                        <p className="font-sans text-sm text-white/30 leading-relaxed">Tap a table on the floor plan to see details and lock in your reservation.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Auth-gate modal */}
      <AnimatePresence>
        {authEvent && (
          <AuthGate event={authEvent} onClose={() => setAuthEvent(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
