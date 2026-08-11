'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Wine, Wind, Ticket, Share2, Store } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type NavItem = {
  href: string
  label: string
  /** One icon normally; two render as a tight combined pair. */
  icons: LucideIcon[]
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icons: [Home] },
  // Sips + Exhales share the /menu route, so they present as one combined block
  { href: '/menu', label: 'The Sips & Exhales', icons: [Wine, Wind] },
  { href: '/reservations', label: 'The Experiences', icons: [Ticket] },
  { href: '/shop', label: 'The Shop', icons: [Store] },
  { href: '/private-parties', label: 'The Culture', icons: [Share2] },
]

export function AppShellNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[60] bg-[#0B111B]/90 backdrop-blur-xl border-t border-white/5"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Static hairline */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      {/* Pulsing ambient underglow — bleeds upward */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -translate-y-full h-10 blur-2xl"
        animate={{
          background: [
            'linear-gradient(90deg, rgba(0,255,255,0.0), rgba(0,255,255,0.4), rgba(255,0,255,0.4), rgba(0,255,255,0.0))',
            'linear-gradient(90deg, rgba(255,0,255,0.4), rgba(0,255,255,0.4), rgba(255,0,255,0.4), rgba(0,255,255,0.4))',
            'linear-gradient(90deg, rgba(0,255,255,0.0), rgba(0,255,255,0.4), rgba(255,0,255,0.4), rgba(0,255,255,0.0))',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="flex items-center justify-between px-1">
        {navItems.map((item) => {
          const isCombined = item.icons.length > 1
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className={`group relative flex flex-col items-center justify-center flex-1 px-2 py-4 lg:py-6 transition-all duration-300 ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {/* Desktop: text label above icon */}
              <span className="hidden lg:block text-xs font-medium mb-2 whitespace-nowrap">
                {item.label}
              </span>
              {/* Icon row — a combined item renders its glyphs tight together,
                  separated by a hairline divider, and scales as one unit */}
              <span className="flex items-center gap-1.5 transition-transform group-hover:scale-110">
                {item.icons.map((Ico, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && (
                      <span aria-hidden="true" className="h-4 lg:h-5 w-px bg-current opacity-25" />
                    )}
                    <Ico
                      className={isCombined ? 'w-5 h-5 lg:w-7 lg:h-7' : 'w-6 h-6 lg:w-8 lg:h-8'}
                      strokeWidth={1.5}
                    />
                  </span>
                ))}
              </span>
              {/* Mobile: label on hover */}
              <span className="lg:hidden absolute bottom-full mb-2 px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </span>
              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
