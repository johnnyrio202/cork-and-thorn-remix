'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users } from 'lucide-react'

// ─── Booth definitions from the actual floor plan PDF ────────────────────────
type BoothStatus = 'available' | 'booked' | 'vip'

interface Booth {
  id: string
  name: string
  capacity: string
  status: BoothStatus
  tier: 'standard' | 'premium' | 'ultra'
  note?: string
}

const BOOTHS: Booth[] = [
  // Stage area (top)
  { id: 'stage-vip',    name: 'Stage VIP',       capacity: '4–12 ppl', status: 'available', tier: 'ultra',   note: 'Best stage view' },
  { id: 'dj-vip',      name: 'DJ VIP',           capacity: '2–4 ppl',  status: 'available', tier: 'ultra',   note: 'Right next to the DJ' },

  // Center cluster
  { id: 'center-1a',   name: 'Center 1',         capacity: '4–8 ppl',  status: 'available', tier: 'premium' },
  { id: 'center-1b',   name: 'B Center 1',       capacity: '2–4 ppl',  status: 'available', tier: 'standard' },
  { id: 'center-2',    name: 'Center 2',         capacity: '4–8 ppl',  status: 'available', tier: 'premium' },
  { id: 'b-center-1',  name: 'B Center 1',       capacity: '2–4 ppl',  status: 'available', tier: 'standard' },

  // Gold row
  { id: 'gold-1',      name: 'Gold 1',           capacity: '4–8 ppl',  status: 'available', tier: 'premium' },
  { id: 'gold-2',      name: 'Gold 2',           capacity: '4–8 ppl',  status: 'available', tier: 'premium' },
  { id: 'gold-3',      name: 'Gold 3',           capacity: '4–8 ppl',  status: 'available', tier: 'premium' },

  // Circle booths
  { id: 'circle-1',    name: 'Circle 1',         capacity: '2–4 ppl',  status: 'available', tier: 'standard' },
  { id: 'circle-2',    name: 'Circle 2',         capacity: '2–4 ppl',  status: 'available', tier: 'standard' },
  { id: 'circle-4',    name: 'Circle 4',         capacity: '2–4 ppl',  status: 'available', tier: 'standard' },

  // Flower area
  { id: 'flower-couch',name: 'Flower Couch',     capacity: '4–8 ppl',  status: 'available', tier: 'premium', note: 'Signature couch booth' },
  { id: 'flower-vip',  name: 'Flower VIP',       capacity: '4–12 ppl', status: 'available', tier: 'premium' },

  // Named VIPs
  { id: 'randi-vip',   name: 'Randi VIP',        capacity: '2–4 ppl',  status: 'available', tier: 'standard' },
  { id: 'brian-vip',   name: 'Brian VIP',        capacity: '2–4 ppl',  status: 'available', tier: 'standard' },

  // Side / Back
  { id: 'side-vip',    name: 'Side VIP',         capacity: '4–8 ppl',  status: 'available', tier: 'premium' },
  { id: 'back-vip',    name: 'Back VIP',         capacity: '8–20 ppl', status: 'available', tier: 'ultra',   note: 'Largest private area' },

  // Premium named
  { id: 'teremana',    name: 'Teremana VIP',     capacity: '8–12 ppl', status: 'available', tier: 'ultra',   note: 'Teremana sponsored booth' },
  { id: 'blue-1',      name: 'Blue 1',           capacity: '8–12 ppl', status: 'available', tier: 'ultra' },
  { id: 'blue-2',      name: 'Blue 2',           capacity: '8–20 ppl', status: 'available', tier: 'ultra',   note: 'Premium large group' },
  { id: 'bellaire',    name: 'Bellaire VIP',     capacity: '2–6 ppl',  status: 'available', tier: 'premium' },
]

// ─── Visual floor plan grid ────────────────────────────────────────────────
// Each zone groups booths by their physical region in the venue
const ZONES: { label: string; ids: string[]; cols: number }[] = [
  { label: 'Stage',          ids: ['stage-vip', 'dj-vip'],                            cols: 2 },
  { label: 'Center',         ids: ['center-1a', 'center-1b', 'center-2', 'b-center-1'], cols: 4 },
  { label: 'Gold Row',       ids: ['gold-1', 'gold-2', 'gold-3'],                     cols: 3 },
  { label: 'Circle',         ids: ['circle-1', 'circle-2', 'circle-4'],               cols: 3 },
  { label: 'Flower',         ids: ['flower-couch', 'flower-vip', 'randi-vip', 'brian-vip'], cols: 4 },
  { label: 'Side & Back',    ids: ['side-vip', 'back-vip', 'teremana'],               cols: 3 },
  { label: 'Blue & Bellaire',ids: ['blue-1', 'blue-2', 'bellaire'],                   cols: 3 },
]

const TIER_STYLES: Record<Booth['tier'], string> = {
  standard: 'border-white/[0.09] bg-white/[0.03] hover:border-white/20',
  premium:  'border-primary/25 bg-primary/[0.05] hover:border-primary/50',
  ultra:    'border-primary/40 bg-primary/[0.09] hover:border-primary/70',
}

const TIER_DOT: Record<Booth['tier'], string> = {
  standard: 'bg-white/30',
  premium:  'bg-primary/60',
  ultra:    'bg-primary',
}

const TIER_LABEL: Record<Booth['tier'], string> = {
  standard: 'Standard',
  premium:  'Premium',
  ultra:    'Ultra VIP',
}

export function SpatialBooking() {
  const [selected, setSelected] = useState<Booth | null>(null)

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
          {ZONES.map((zone, zi) => {
            const booths = zone.ids.map(id => BOOTHS.find(b => b.id === id)!).filter(Boolean)
            return (
              <div key={zone.label}>
                <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-white/20 mb-2.5">{zone.label}</p>
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${zone.cols}, minmax(0, 1fr))` }}
                >
                  {booths.map((booth, bi) => (
                    <motion.button
                      key={booth.id}
                      onClick={() => setSelected(booth)}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: zi * 0.04 + bi * 0.02 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`rounded-xl border px-3 py-3 text-left transition-colors duration-150 ${TIER_STYLES[booth.tier]} ${selected?.id === booth.id ? '!border-primary ring-1 ring-primary/40' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p className="font-sans text-xs font-semibold text-white leading-tight">{booth.name}</p>
                        <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${TIER_DOT[booth.tier]}`} />
                      </div>
                      <p className="font-sans text-[10px] text-white/35 mt-1 flex items-center gap-1">
                        <Users className="w-2.5 h-2.5" />{booth.capacity}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelected(null)}
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
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.07] hover:bg-white/10 transition-colors"
              >
                <X className="h-3.5 w-3.5 text-white/60" />
              </button>

              <div className="mb-1 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${TIER_DOT[selected.tier]}`} />
                <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-white/40">{TIER_LABEL[selected.tier]}</span>
              </div>
              <h3 className="font-serif text-2xl text-white mb-1">{selected.name}</h3>
              <p className="font-sans text-sm text-white/40 flex items-center gap-1.5 mb-4">
                <Users className="w-3.5 h-3.5" />{selected.capacity}
              </p>
              {selected.note && (
                <p className="font-sans text-xs text-primary/70 mb-4 rounded-lg border border-primary/15 bg-primary/[0.05] px-3 py-2">
                  {selected.note}
                </p>
              )}
              <a
                href="/reservations"
                className="block w-full rounded-xl bg-primary px-4 py-3 text-center font-sans text-sm font-semibold text-black hover:bg-primary/90 transition-colors"
              >
                Reserve This Booth
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
