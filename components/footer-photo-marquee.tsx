'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

// Real venue photography, same set the old static masonry grid used —
// now a compact auto-scrolling strip (~3 visible at a time) instead of a
// 6-image grid eating footer real estate. Static file paths for now; swap
// for a live Instagram feed later if that gets wired up ("not much more
// is needed to feed from the Instagram account").
const photos = [
  { src: '/images/venue-stage.jpeg', alt: 'Live band performing on the Cork and Thorn stage' },
  { src: '/images/pour-cup.jpeg', alt: 'Bottle pour at the bar' },
  { src: '/images/venue-hookah.jpeg', alt: 'Neon-lit hookah lounge bar' },
  { src: '/images/performer-vocalist.jpeg', alt: 'Vocalist performing to the crowd' },
  { src: '/images/venue-bar.jpeg', alt: 'Main bar under warm neon lighting' },
  { src: '/images/performer-mic.jpeg', alt: 'Emcee on the mic in a leather jacket' },
]

export function FooterPhotoMarquee() {
  return (
    <div className="relative w-[184px] shrink-0 overflow-hidden rounded-lg">
      <motion.div
        aria-hidden="true"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="flex shrink-0 gap-2"
      >
        {[...photos, ...photos].map((photo, i) => (
          <div
            key={i}
            className="relative h-9 w-14 shrink-0 overflow-hidden rounded-md border border-border/60"
          >
            <Image src={photo.src} alt={photo.alt} fill sizes="56px" className="object-cover" />
          </div>
        ))}
      </motion.div>
      {/* Edge fade so the loop seam and the strip's cut edges read as intentional */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-card to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-card to-transparent" />
    </div>
  )
}
