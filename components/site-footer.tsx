'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Clock } from 'lucide-react'
import { InstagramIcon, FacebookIcon, TikTokIcon } from '@/components/social-icons'
import { Logo } from '@/components/logo'
import { FooterPhotoMarquee } from '@/components/footer-photo-marquee'
import { toast } from 'sonner'

const footerNav = [
  { href: '/events', label: 'Events' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/menu', label: 'Menu' },
  { href: '/shop', label: 'Shop' },
  { href: '/private-parties', label: 'Private Parties' },
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
    <footer className="relative overflow-hidden border-t border-border bg-card">
      {/* Ambient neon underglow — same pulsing cyan/magenta as the header */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-8 blur-2xl"
        animate={{
          background: [
            'linear-gradient(90deg, rgba(0,255,255,0.0), rgba(0,255,255,0.4), rgba(255,0,255,0.4), rgba(0,255,255,0.0))',
            'linear-gradient(90deg, rgba(255,0,255,0.4), rgba(0,255,255,0.4), rgba(255,0,255,0.4), rgba(0,255,255,0.4))',
            'linear-gradient(90deg, rgba(0,255,255,0.0), rgba(0,255,255,0.4), rgba(255,0,255,0.4), rgba(0,255,255,0.0))',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Row 1: brand + nav + social, one line on desktop */}
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="flex gap-1.5">
              {[
                { icon: InstagramIcon, label: 'Instagram' },
                { icon: FacebookIcon, label: 'Facebook' },
                { icon: TikTokIcon, label: 'TikTok' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {footerNav.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>

          <FooterPhotoMarquee />
        </div>

        {/* Row 2: contact info + newsletter, one line on desktop */}
        <div className="mt-4 flex flex-col gap-3 border-t border-border/60 pt-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 shrink-0 text-primary" />
              70 West Imperial Avenue, Las Vegas, NV 89102
            </span>
            <a href="tel:7252089328" className="flex items-center gap-1.5 hover:text-foreground">
              <Phone className="h-3 w-3 shrink-0 text-primary" />
              (725) 208-9328
            </a>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 shrink-0 text-primary" />
              Wed–Sun · 8PM – Late
            </span>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="glass-champagne flex w-full max-w-xs items-center gap-2 rounded-full p-1 pl-3 lg:w-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Join the Inner Circle"
              aria-label="Email address"
              className="min-w-0 flex-1 bg-transparent text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Join
            </button>
          </form>
        </div>

        {/* Row 3: copyright */}
        <div className="mt-4 flex flex-col items-center justify-between gap-1 border-t border-border/60 pt-3 text-[10px] text-muted-foreground sm:flex-row">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} Cork and Thorn. All rights reserved.
          </p>
          <p>Drink responsibly. Must be 21+ with valid ID.</p>
        </div>
      </div>
    </footer>
  )
}
