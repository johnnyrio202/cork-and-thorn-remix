'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useVIP } from '@/components/vip-provider'
import { Logo } from '@/components/logo'
import { Crown, Menu, X, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'

export function AppShellHeader() {
  const { isVIP, toggleVIP } = useVIP()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 40)
  })

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100]">

        {/* Ambient underglow — always present so the neon bleeds over the
            kinetic canvas scrubbing beneath it, even at the very top. Pulses
            cyan/magenta for public, champagne rose for VIP. Intensifies once
            the frosted backdrop engages on scroll. */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: scrolled ? 1 : 0.72 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-x-0 -bottom-8 h-16 blur-3xl"
        >
          <motion.div
            className="h-full w-full"
            animate={
              isVIP
                ? {
                    background: [
                      'linear-gradient(90deg, rgba(212,175,132,0.0), rgba(212,175,132,0.55), rgba(226,182,54,0.35), rgba(212,175,132,0.0))',
                      'linear-gradient(90deg, rgba(212,175,132,0.35), rgba(226,182,54,0.5), rgba(212,175,132,0.55), rgba(226,182,54,0.35))',
                      'linear-gradient(90deg, rgba(212,175,132,0.0), rgba(212,175,132,0.55), rgba(226,182,54,0.35), rgba(212,175,132,0.0))',
                    ],
                  }
                : {
                    background: [
                      'linear-gradient(90deg, rgba(0,255,255,0.0), rgba(0,255,255,0.55), rgba(255,0,255,0.55), rgba(0,255,255,0.0))',
                      'linear-gradient(90deg, rgba(255,0,255,0.55), rgba(0,255,255,0.55), rgba(255,0,255,0.55), rgba(0,255,255,0.55))',
                      'linear-gradient(90deg, rgba(0,255,255,0.0), rgba(0,255,255,0.55), rgba(255,0,255,0.55), rgba(0,255,255,0.0))',
                    ],
                  }
            }
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Scroll-reactive frosted glass backdrop */}
        <motion.div
          animate={{
            backgroundColor: scrolled ? 'rgba(11, 17, 27, 0.72)' : 'rgba(11, 17, 27, 0)',
            borderColor: scrolled
              ? isVIP
                ? 'rgba(212, 175, 132, 0.4)'
                : 'rgba(226, 182, 54, 0.22)'
              : 'rgba(226, 182, 54, 0)',
            backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
            boxShadow: scrolled
              ? isVIP
                ? '0 8px 40px -12px rgba(212, 175, 132, 0.5)'
                : '0 8px 40px -12px rgba(0, 255, 255, 0.25)'
              : '0 0 0 0 rgba(0,0,0,0)',
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative border-b"
        >
          <div className="relative h-32 px-4 lg:px-6 flex items-center justify-between">

            {/* Left: Hamburger Menu */}
            <div className="z-20">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-6 h-6" strokeWidth={1.5} />
                )}
              </button>
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 z-10 w-[240px] sm:w-[380px] lg:w-[520px] flex justify-center">
              <Logo />
            </div>

            {/* Right: VIP Access + Cart */}
            <div className="flex items-center gap-2 lg:gap-3 z-20">
              <button
                onClick={toggleVIP}
                className={`group relative px-4 py-2 rounded-full font-medium text-xs lg:text-sm transition-all duration-300 ${
                  isVIP
                    ? 'bg-gradient-to-r from-[#E2B636] to-rose-400 text-black shadow-lg shadow-rose-400/40'
                    : 'glass-champagne text-foreground hover:shadow-lg hover:shadow-cyan-400/20'
                }`}
              >
                <span className="relative flex items-center gap-1">
                  {isVIP && <Crown className="w-3 h-3 lg:w-4 lg:h-4" />}
                  <span>{isVIP ? 'VIP' : 'VIP ACCESS'}</span>
                </span>
                {!isVIP && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </button>

              <Link
                href="/shop"
                className="group relative p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={1.5} />
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>

          </div>
        </motion.div>

        {/* Hamburger dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-32 left-0 min-w-56 bg-[rgba(11,17,27,0.95)] border border-white/10 border-t-0 backdrop-blur-xl rounded-br-lg"
            >
              <nav className="flex flex-col gap-1 p-4">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/menu', label: 'The Sips' },
                  { href: '/menu', label: 'The Exhales' },
                  { href: '/reservations', label: 'The Experiences' },
                  { href: '/private-parties', label: 'The Culture' },
                  { href: '/events', label: 'Events' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-2.5 text-sm text-foreground hover:text-primary transition-colors border-b border-white/5"
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Member Access group — always-available account entry points */}
                <span className="px-3 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary/70">
                  Member Access
                </span>
                {[
                  { href: '/loyalty', label: 'Inner Circle Login' },
                  { href: '/affiliate', label: 'Affiliate Program Login' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-2.5 text-sm text-foreground hover:text-primary transition-colors border-b border-white/5 last:border-0"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

      </header>

      {/* Safe spacing for content below fixed header */}
      <div className="h-32" />
    </>
  )
}
