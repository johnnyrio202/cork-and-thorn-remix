'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, Lock } from 'lucide-react'
import { BOOTHS, BOOTH_ZONES, type Booth, type BoothTier } from '@/lib/data'

export type AvailabilityMap = Record<string, 'available' | 'taken'>

export type BoothOccupant = {
  guest_name: string
  arrival_time: string
  status: string
}

interface SpatialBookingProps {
  date?: string
  availability?: AvailabilityMap
  selectedBoothId?: string | null
  onSelectBooth?: (booth: Booth) => void
  mode?: 'guest' | 'staff'
  occupants?: Record<string, BoothOccupant>
  onCancelBooth?: (boothId: string) => void
  onNoShowBooth?: (boothId: string) => void
}

const TIER_STYLES: Record<BoothTier, string> = {
  standard: 'border-white/[0.09] bg-white/[0.03] hover:border-white/20',
  premium:  'border-primary/25 bg-primary/[0.05] hover:border-primary/50',
  ultra:    'border-primary/40 bg-primary/[0.09] hover:border-primary/70',
}

const TIER_DOT: Record<BoothTier, string> = {
  standard: 'bg-white/30',
  premium:  'bg-primary/60',
  ultra:    'bg-primary',
}

const TIER_LABEL: Record<BoothTier, string> = {
  standard: 'Standard',
  premium:  'Premium',
  ultra:    'Ultra VIP',
}

export function SpatialBooking({
  date,
  availability,
  selectedBoothId,
  onSelectBooth,
  mode = 'guest',
  occupants,
  onCancelBooth,
  onNoShowBooth,
}: SpatialBookingProps) {
  const [detail, setDetail] = useState<Booth | null>(null)

  function handleBoothClick(booth: Booth) {
    const taken = availability?.[booth.id] === 'taken'
    if (mode === 'staff') {
      setDetail(booth)
      return
    }
    if (taken || !date) return
    onSelectBooth?.(booth)
    setDetail(booth)
  }

  return (
    <section className="w-full px-4 py-10 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-1">Interactive</p>
          <h2 className="font-serif text-3xl md:text-4xl text-white">Floor Plan</h2>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] font-sans text-white/40">
          {(['standard', 'premium', 'ultra'] as const).map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${TIER_DOT[t]}`} />
              {TIER_LABEL[t]}
            </span>
          ))}
        </div>
      </div>

      {mode === 'guest' && !date && (
        <p className="mb-5 rounded-xl border border-primary/20 bg-primary/[0.05] px-4 py-3 text-center font-sans text-sm text-primary/70">
          Pick a date above to see real-time table availability.
        </p>
      )}

      {/* Venue wrapper */}
      <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden p-5 md:p-8">

        {/* Stage indicator at top */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/[0.07] px-6 py-2">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary/70">Main Stage</span>
          </div>
        </div>

        {/* Hookah Entrance indicator */}
        <div className="absolute bottom-5 right-5 md:bottom-8 md:right-8">
          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/30">Hookah Entrance</span>
          </div>
        </div>

        {/* Zones */}
        <div className="flex flex-col gap-5">
          {BOOTH_ZONES.map((zone, zi) => {
            const booths = zone.ids.map(id => BOOTHS.find(b => b.id === id)!).filter(Boolean)
            return (
              <div key={zone.label}>
                <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-white/20 mb-2.5">{zone.label}</p>
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${zone.cols}, minmax(0, 1fr))` }}
                >
                  {booths.map((booth, bi) => {
                    const taken = availability?.[booth.id] === 'taken'
                    const disabled = mode === 'guest' && (taken || !date)
                    return (
                      <motion.button
                        key={booth.id}
                        type="button"
                        onClick={() => handleBoothClick(booth)}
                        disabled={disabled}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18, delay: zi * 0.04 + bi * 0.02 }}
                        whileHover={disabled ? undefined : { scale: 1.03 }}
                        whileTap={disabled ? undefined : { scale: 0.97 }}
                        className={`rounded-xl border px-3 py-3 text-left transition-colors duration-150 ${
                          taken
                            ? 'border-white/[0.05] bg-white/[0.015] opacity-40 cursor-not-allowed'
                            : TIER_STYLES[booth.tier]
                        } ${selectedBoothId === booth.id ? '!border-primary ring-1 ring-primary/40' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <p className="font-sans text-xs font-semibold text-white leading-tight">{booth.name}</p>
                          {taken ? (
                            <Lock className="mt-0.5 h-2.5 w-2.5 shrink-0 text-white/30" />
                          ) : (
                            <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${TIER_DOT[booth.tier]}`} />
                          )}
                        </div>
                        <p className="font-sans text-[10px] text-white/35 mt-1 flex items-center gap-1">
                          <Users className="w-2.5 h-2.5" />{booth.capacity}
                        </p>
                        {mode === 'staff' && taken && occupants?.[booth.id] && (
                          <p className="font-sans text-[10px] text-primary/70 mt-1 truncate">
                            {occupants[booth.id].guest_name} · {occupants[booth.id].arrival_time}
                          </p>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {detail && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setDetail(null)}
            />
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-white/[0.08] bg-[#0e0e0e] p-6 pb-10 md:left-auto md:right-6 md:bottom-6 md:w-80 md:rounded-2xl md:border"
            >
              <button
                onClick={() => setDetail(null)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.07] hover:bg-white/10 transition-colors"
              >
                <X className="h-3.5 w-3.5 text-white/60" />
              </button>

              <div className="mb-1 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${TIER_DOT[detail.tier]}`} />
                <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-white/40">{TIER_LABEL[detail.tier]}</span>
              </div>
              <h3 className="font-serif text-2xl text-white mb-1">{detail.name}</h3>
              <p className="font-sans text-sm text-white/40 flex items-center gap-1.5 mb-4">
                <Users className="w-3.5 h-3.5" />{detail.capacity}
              </p>
              {detail.note && (
                <p className="font-sans text-xs text-primary/70 mb-4 rounded-lg border border-primary/15 bg-primary/[0.05] px-3 py-2">
                  {detail.note}
                </p>
              )}

              {mode === 'guest' ? (
                <p className="rounded-xl bg-primary px-4 py-3 text-center font-sans text-sm font-semibold text-black">
                  Selected — continue below to reserve
                </p>
              ) : (
                <>
                  {occupants?.[detail.id] ? (
                    <div className="mb-4 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2">
                      <p className="font-sans text-sm text-white">{occupants[detail.id].guest_name}</p>
                      <p className="font-sans text-xs text-white/40">{occupants[detail.id].arrival_time} · {occupants[detail.id].status}</p>
                    </div>
                  ) : (
                    <p className="mb-4 font-sans text-sm text-white/40">Available</p>
                  )}
                  {occupants?.[detail.id] && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => { onCancelBooth?.(detail.id); setDetail(null) }}
                        className="flex-1 rounded-lg border border-white/10 px-3 py-2 font-sans text-xs font-semibold text-white hover:bg-white/5"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => { onNoShowBooth?.(detail.id); setDetail(null) }}
                        className="flex-1 rounded-lg border border-destructive/30 px-3 py-2 font-sans text-xs font-semibold text-destructive hover:bg-destructive/10"
                      >
                        No-show
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
