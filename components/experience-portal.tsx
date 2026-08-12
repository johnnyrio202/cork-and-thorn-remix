'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { EventItem } from '@/lib/data'

// ---------------------------------------------------------------------------
// Category → vibe intel mapping
// ---------------------------------------------------------------------------
const VIBE_INTEL: Record<string, { sound: string; code: string }> = {
  'R&B':        { sound: 'Smooth R&B & Neo-Soul',              code: 'Sophisticated. Sensual. Noir.' },
  'Hip-Hop':    { sound: 'Classic & Current Hip-Hop',          code: 'Unapologetically Bold.' },
  'Live Band':  { sound: 'Live Soul, Funk & Hip-Hop',          code: 'Strictly Sophisticated Noir.' },
  'DJ Set':     { sound: 'Curated Afro-Beats & Deep House',    code: 'Elevated. Immersive. Electric.' },
  'Open Mic':   { sound: 'Spoken Word, Vocals & Bars',         code: 'Raw. Authentic. Ours.' },
  'Game Night': { sound: 'Good Music. Better Vibes.',          code: 'Come correct. Leave legendary.' },
}

// Archive grid images — asymmetric masonry uses 5 images across 3 columns
const ARCHIVE = [
  { src: '/images/venue-bar.jpeg',        alt: 'The bar in full swing',       span: 'row-span-2' },
  { src: '/images/performer-mic.jpeg',    alt: 'Live performer on the mic',   span: 'row-span-1' },
  { src: '/images/venue-stage.jpeg',      alt: 'Stage lighting',              span: 'row-span-1' },
  { src: '/images/performer-vocalist.jpeg', alt: 'Vocalist performing',       span: 'row-span-2' },
  { src: '/images/venue-hookah.jpeg',     alt: 'Hookah lounge atmosphere',    span: 'row-span-1' },
]

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ExperiencePortalProps {
  event?:        EventItem
  onRSVPClick?:  () => void
  onTableClick?: () => void
}

// ---------------------------------------------------------------------------
// Vibe stat card
// ---------------------------------------------------------------------------
function VibeStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.04] backdrop-blur-xl p-7 md:p-9">
      <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary/60">{label}</p>
      <p className="font-sans text-lg md:text-xl text-white/90 leading-snug">{value}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Archive image — hover scale
// ---------------------------------------------------------------------------
function ArchiveImage({ src, alt, span }: { src: string; alt: string; span: string }) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl ${span}`}
      whileHover={{ scale: 1.025 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B111B]/40 to-transparent" />
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function ExperiencePortal({ event, onRSVPClick, onTableClick }: ExperiencePortalProps) {
  const heroRef    = useRef<HTMLDivElement>(null)
  const [tablePulse] = useState(true)

  // Resolve display data — fall back to defaults when no event prop is passed
  const vibe  = VIBE_INTEL[event?.category ?? ''] ?? { sound: 'Curated Afro-Beats & Deep House', code: 'Strictly Sophisticated Noir.' }
  const name       = event?.title    ?? 'The Velvet Sessions'
  const tagline    = event?.day      ? `Every ${event.day} Night` : 'Every Friday Night'
  const heroImg    = event?.image    ?? '/images/event-dj-night.png'
  const talent     = event?.artist   ?? 'DJ Tone Arms'
  const talentRole = event?.category ?? 'Resident'
  const hours      = event?.time     ? `${event.time} until close.` : '10:00 PM until close.'

  // Parallax: hero image moves at 40% of scroll speed
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yParallax = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])

  return (
    <div className="relative bg-[#0B111B] text-white min-h-screen">

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1 — HERO                                                   */}
      {/* ------------------------------------------------------------------ */}
      <section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      >
        {/* Parallax background image */}
        <motion.div
          style={{ y: yParallax }}
          className="absolute inset-0 scale-110 will-change-transform"
        >
          <img
            src={heroImg}
            alt={name}
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Obsidian vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B111B] via-[#0B111B]/50 to-[#0B111B]/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0B111B_100%)]" />

        {/* Foreground copy */}
        <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-sans text-xs uppercase tracking-[0.4em] text-primary/70"
          >
            {tagline} &nbsp;&middot;&nbsp; {talent}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans font-bold text-[clamp(2.8rem,8vw,7rem)] leading-none tracking-tight text-white"
          >
            {name}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
            className="h-px w-32 origin-left bg-primary/50"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="font-sans text-sm md:text-base text-white/50 max-w-sm leading-relaxed"
          >
            {talentRole}
          </motion.p>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <div className="h-8 w-px bg-white" />
          <p className="font-sans text-[9px] uppercase tracking-[0.35em] text-white">Scroll</p>
        </motion.div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 2 — VIBE INTEL                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative z-10 -mt-20 px-6 md:px-12 pb-24">
        <div className="mx-auto max-w-5xl">
          {/* Section label */}
          <p className="mb-8 font-sans text-[10px] uppercase tracking-[0.4em] text-primary/50">
            Vibe Intel
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <VibeStat label="The Sound" value={vibe.sound} />
            <VibeStat label="The Code"  value={vibe.code}  />
            <VibeStat label="The Hours" value={hours}      />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 3 — THE ARCHIVE                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="px-6 md:px-12 pb-40">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 font-sans text-[10px] uppercase tracking-[0.4em] text-primary/50">
            Visual Record
          </p>
          <h2 className="mb-10 font-sans text-4xl md:text-5xl text-white">The Archive</h2>

          {/* Asymmetric masonry: 2 columns on mobile (3 fixed-width columns at
              a 260px row height left thumbnails as narrow, stretched slivers
              on phones), scaling up to 3 columns with taller rows on larger
              screens. row-span-1/2 on each image still drives the masonry
              effect at every size. */}
          <div className="grid grid-cols-2 sm:grid-cols-3 auto-rows-[140px] sm:auto-rows-[200px] md:auto-rows-[260px] gap-3">
            {ARCHIVE.map((img, i) => (
              <ArchiveImage key={i} {...img} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 4 — STICKY FLOATING CTA BAR                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0B111B]/70 px-5 py-3.5 shadow-[0_8px_48px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
        >
          {/* Ghost button — Join Guest List */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRSVPClick}
            className="rounded-xl border border-primary/35 bg-transparent px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/10"
          >
            Join Guest List
          </motion.button>

          {/* Divider */}
          <div className="h-6 w-px bg-white/10" />

          {/* Primary button — Secure a Table */}
          <motion.button
            whileHover={{
              scale: 1.04,
              boxShadow: '0 0 40px rgba(226,182,54,0.65), 0 0 18px rgba(255,45,120,0.35)',
            }}
            whileTap={{ scale: 0.97 }}
            onClick={onTableClick}
            className="relative overflow-hidden rounded-xl bg-primary px-8 py-3 font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#0B111B]"
          >
            {/* Pulsing glow ring */}
            {tablePulse && (
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-xl"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(226,182,54,0.55)',
                    '0 0 0 10px rgba(226,182,54,0)',
                  ],
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            Secure a Table
          </motion.button>
        </motion.div>
      </div>

    </div>
  )
}
