'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Wine } from 'lucide-react'
import type { EventItem } from '@/lib/data'

// This used to embed a full interactive weekly booking calendar
// (WeeklyCalendarCarousel) inline on the homepage — a direct duplicate of
// the dedicated /events and /reservations pages. Cut down to a teaser that
// routes to those real pages instead, per the "true pages, not one long
// scroll" homepage pass.
const TEASERS = [
  {
    key: 'events',
    href: '/events',
    icon: Calendar,
    title: "What's On",
    blurb: 'Live music, DJ sets, and one-off nights — pick a date and grab tickets.',
  },
  {
    key: 'reservations',
    href: '/reservations',
    icon: Wine,
    title: 'Reserve a Table',
    blurb: 'Bottle service, VIP tiers, and the full floor plan.',
  },
] as const

export function ExperiencesSection({ events }: { events: EventItem[] }) {
  return (
    <section className="relative w-full bg-[#0B111B] px-6 pt-10 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-primary/80 mb-3">
            The Room
          </p>
          <h2 className="font-sans text-2xl sm:text-3xl text-white">
            Experiences
          </h2>
          {events.length > 0 && (
            <p className="mt-2 text-xs text-gray-400">
              {events.length} upcoming event{events.length === 1 ? '' : 's'} on the calendar
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {TEASERS.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.08 }}
            >
              <Link
                href={item.href}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5 hover:border-primary/40 transition-colors duration-300 overflow-hidden h-full"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(226,182,54,0.12),transparent_60%)]" />
                <item.icon className="w-6 h-6 text-primary mb-4 relative" strokeWidth={1.5} />
                <h3 className="font-sans text-base md:text-lg text-white mb-1.5 relative">
                  {item.title}
                </h3>
                <p className="font-sans text-xs md:text-sm text-gray-400 leading-relaxed relative flex-1">
                  {item.blurb}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-primary/60 group-hover:text-primary transition-colors duration-200 relative">
                  {item.title === 'Reserve a Table' ? 'Book now' : 'View events'}
                  <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
