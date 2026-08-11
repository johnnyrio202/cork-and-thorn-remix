'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Clock } from 'lucide-react'
import { InstagramIcon, FacebookIcon, TikTokIcon } from '@/components/social-icons'
import { Logo } from '@/components/logo'
import { toast } from 'sonner'

const footerNav = [
  { href: '/events', label: 'Events' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/menu', label: 'Menu' },
  { href: '/shop', label: 'Shop' },
  { href: '/private-parties', label: 'Private Parties' },
]

// Real venue photography mapped into an asymmetrical masonry social grid.
const socialGrid = [
  { src: '/images/venue-stage.jpeg', alt: 'Live band performing on the Cork and Thorn stage', span: 'row-span-2' },
  { src: '/images/pour-cup.jpeg', alt: 'Bottle pour at the bar', span: '' },
  { src: '/images/venue-hookah.jpeg', alt: 'Neon-lit hookah lounge bar', span: '' },
  { src: '/images/performer-vocalist.jpeg', alt: 'Vocalist performing to the crowd', span: '' },
  { src: '/images/venue-bar.jpeg', alt: 'Main bar under warm neon lighting', span: 'row-span-2' },
  { src: '/images/performer-mic.jpeg', alt: 'Emcee on the mic in a leather jacket', span: '' },
]

export function SiteFooter() {
  const [email, setEmail] = useState('')

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    toast.success('Welcome to the list', {
      description: 'You’re on the VIP guest list. Watch your inbox for exclusive drops.',
    })
    setEmail('')
  }

  return (
    <footer className="relative overflow-hidden border-t border-border bg-card pb-24 lg:pb-0">
      {/* Ambient neon underglow — same pulsing cyan/magenta as the header */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-10 blur-2xl"
        animate={{
          background: [
            'linear-gradient(90deg, rgba(0,255,255,0.0), rgba(0,255,255,0.4), rgba(255,0,255,0.4), rgba(0,255,255,0.0))',
            'linear-gradient(90deg, rgba(255,0,255,0.4), rgba(0,255,255,0.4), rgba(255,0,255,0.4), rgba(0,255,255,0.4))',
            'linear-gradient(90deg, rgba(0,255,255,0.0), rgba(0,255,255,0.4), rgba(255,0,255,0.4), rgba(0,255,255,0.0))',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Inner Circle capture band */}
      <div className="border-b border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-[25px] pb-[20px] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="font-heading text-3xl tracking-wide sm:text-4xl">
              Join the <span className="text-primary neon-glow">Inner Circle</span>
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Early ticket access, private events, and off-menu bottle specials —
              straight to your inbox.
            </p>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="glass-champagne flex w-full max-w-md items-center gap-2 rounded-full p-1.5 pl-5"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              className="group relative shrink-0 overflow-hidden rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 hover:shadow-glow-secondary"
            >
              <span className="relative">Join</span>
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-[34px] pb-[38px] sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Las Vegas’ premier live events lounge. Premium hookah, craft
              cocktails, and nightly R&amp;B and hip-hop.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: InstagramIcon, label: 'Instagram' },
                { icon: FacebookIcon, label: 'Facebook' },
                { icon: TikTokIcon, label: 'TikTok' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg tracking-wide">Explore</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg tracking-wide">Visit Us</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <li className="flex gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span>
                  70 West Imperial Avenue
                  <br />
                  Las Vegas, NV 89102
                </span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href="tel:7252089328" className="hover:text-foreground">
                  (725) 208-9328
                </a>
              </li>
              <li className="flex gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                <span>
                  Wed–Sun · 8PM – Late
                  <br />
                  Fri &amp; Sat reservations after 10PM
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg tracking-wide">@corkandthorn</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Straight from the floor. Tag us to be featured.
            </p>
            <div className="mt-4 grid auto-rows-[64px] grid-cols-3 gap-2">
              {socialGrid.map((item) => (
                <a
                  key={item.src}
                  href="#"
                  aria-label={item.alt}
                  className={`group relative overflow-hidden rounded-lg border border-border/60 ${item.span}`}
                >
                  <Image
                    src={item.src || '/placeholder.svg'}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 1024px) 30vw, 120px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute inset-0 bg-obsidian/40 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} Cork and Thorn. All rights reserved.
          </p>
          <p>Drink responsibly. Must be 21+ with valid ID.</p>
        </div>
      </div>
    </footer>
  )
}
