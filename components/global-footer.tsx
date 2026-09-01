'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Share2, Heart, type LucideIcon } from 'lucide-react'

type FooterLink = { label: string; icon?: LucideIcon; value?: string; href?: string }

export function GlobalFooter() {
  const footerSections: { title: string; links: FooterLink[] }[] = [
    {
      title: 'Contact',
      links: [
        { label: 'Email', icon: Mail, value: 'hello@corkandthorn.com' },
        { label: 'Phone', icon: Phone, value: '+1 (555) 000-0000' },
        { label: 'Location', icon: MapPin, value: '123 Main St, Downtown' },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
    {
      title: 'Quick Links',
      links: [
        { label: 'Book a Table' },
        { label: 'Events' },
        { label: 'Menu' },
        { label: 'Careers', href: '/jobs' },
        { label: 'Private Events', href: '/private-parties' },
        { label: 'Catering', href: '/catering' },
      ],
    },
    {
      title: 'FAQ',
      links: [
        { label: 'Dress Code?' },
        { label: 'Reservations' },
        { label: 'Hours' },
        { label: 'Group Bookings' },
        { label: 'VIP Access' },
      ],
    },
    {
      title: 'Social',
      links: [
        { label: 'Instagram', icon: Share2 },
        { label: 'Twitter', icon: Share2 },
        { label: 'TikTok', icon: Heart },
      ],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <footer className="border-t border-primary/20 bg-background pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="mb-16 grid gap-8 md:grid-cols-4"
        >
          {footerSections.map((section, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <h3 className="mb-6 font-heading text-lg text-primary">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => {
                  const Icon = link.icon
                  const href = link.href ?? '#'
                  return (
                    <li key={linkIdx}>
                      {Icon ? (
                        <a
                          href={href}
                          className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </a>
                      ) : (
                        <a
                          href={href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="mb-8 border-t border-primary/20" />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-between gap-8 py-8 md:flex-row md:items-center"
        >
          <div>
            <p className="text-sm text-muted-foreground">
              © 2026 Cork and Thorn. All rights reserved.
            </p>
            <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
              <a href="#" className="transition-colors hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="transition-colors hover:text-foreground">
                Terms of Service
              </a>
              <a href="/jobs" className="transition-colors hover:text-foreground">
                Careers
              </a>
            </div>
          </div>

          {/* Hours */}
          <div className="glass-light rounded-none p-4 text-right">
            <p className="text-xs text-muted-foreground">HOURS</p>
            <p className="font-heading text-sm text-foreground">
              Wed - Sun: 5PM - 2AM
            </p>
            <p className="text-xs text-muted-foreground">Closed Mondays & Tuesdays</p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
