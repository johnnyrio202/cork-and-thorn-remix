'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

// Slow, non-aggressive pulse — shadow breathes between dim and bright gold
const pulseVariants = {
  dim: {
    boxShadow: '0 0 0px rgba(226, 182, 54, 0)',
  },
  bright: {
    boxShadow: '0 0 28px 6px rgba(226, 182, 54, 0.45)',
  },
}

export function PersistentVIPBar() {
  return (
    <div
      className="fixed inset-x-0 z-[70] flex justify-center pointer-events-none bottom-[calc(56px+env(safe-area-inset-bottom)+16px)] lg:bottom-[calc(104px+20px)]"
      aria-label="VIP actions"
    >
      {/* Pill container */}
      <div
        className="pointer-events-auto flex items-center gap-px overflow-hidden rounded-full backdrop-blur-2xl"
        style={{
          background: 'rgba(11, 17, 27, 0.82)',
          border: '1px solid rgba(245, 236, 210, 0.18)',
        }}
      >
        {/* Guest List link */}
        <Link
          href="/reservations#guest-list"
          className="group relative flex h-12 items-center px-7 font-sans text-sm font-medium tracking-widest uppercase text-white/55 transition-colors duration-300 hover:text-white"
        >
          {/* Subtle left-side hover fill */}
          <span
            className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: 'rgba(255,255,255,0.04)' }}
            aria-hidden="true"
          />
          <span className="relative">View Guest List</span>
        </Link>

        {/* 1px internal divider */}
        <span
          className="block h-5 w-px shrink-0"
          style={{ background: 'rgba(245, 236, 210, 0.15)' }}
          aria-hidden="true"
        />

        {/* Secure a Table — pulsing gold button */}
        <motion.div
          variants={pulseVariants}
          initial="dim"
          animate="bright"
          transition={{
            duration: 2.8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          className="m-1.5 rounded-full"
        >
          <Link
            href="/reservations#reserve"
            className="group relative flex h-9 items-center overflow-hidden rounded-full px-6 font-sans text-sm font-bold tracking-widest uppercase text-[#0B111B] transition-all duration-300"
            style={{ background: '#E2B636' }}
          >
            {/* Magenta hover wash */}
            <span
              className="absolute inset-0 rounded-full bg-[#C0176A] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden="true"
            />
            <span className="relative">Secure a Table</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
