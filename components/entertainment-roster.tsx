'use client'

import { motion } from 'framer-motion'
import { Music, Users, Link2 } from 'lucide-react'
import Image from 'next/image'

export function EntertainmentRoster() {
  const artists = [
    {
      id: 1,
      name: 'The Headliner',
      role: 'Resident MC',
      speciality: 'Hip-Hop & Live Sets',
      bio: 'Chief architect of our sonic identity',
      image: '/images/performer-mic.jpeg',
    },
    {
      id: 2,
      name: 'The Velvet Keys',
      role: 'Live Band',
      speciality: 'Soul & R&B',
      bio: 'Sultry vocals with commanding presence',
      image: '/images/performer-vocalist.jpeg',
    },
    {
      id: 3,
      name: 'HarleeQ',
      role: 'Hookah & Hospitality',
      speciality: 'Bespoke Lounge Service',
      bio: 'Brings the venue to life',
      image: '/images/pour-cup.jpeg',
    },
  ]

  const promoterTools = [
    {
      name: 'Link Generator',
      description: 'Create unique promo codes & affiliate links',
      icon: Link2,
    },
    {
      name: 'Analytics Dashboard',
      description: 'Track clicks, conversions & ROI in real-time',
      icon: Users,
    },
    {
      name: 'Event Tools',
      description: 'Schedule posts, manage promotions',
      icon: Music,
    },
  ]

  return (
    <section className="spacing-fluid-lg min-h-screen bg-background">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-heading mb-4 text-5xl text-foreground sm:text-6xl">
            <span className="text-primary">Entertainment</span> Roster
          </h2>
          <p className="text-lg text-muted-foreground">
            Meet our resident talent & promoter command center
          </p>
        </motion.div>

        {/* Artists */}
        <div className="mb-20">
          <h3 className="mb-8 font-heading text-2xl text-foreground">
            Resident Talent
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {artists.map((artist, idx) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                className="glass-dark rounded-none p-6"
              >
                {/* Artist Photo */}
                <div className="relative mb-6 aspect-square overflow-hidden rounded-none">
                  <Image
                    src={artist.image || '/placeholder.svg'}
                    alt={artist.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                </div>

                <h4 className="mb-1 font-heading text-lg text-foreground">
                  {artist.name}
                </h4>
                <p className="mb-3 text-sm text-primary">{artist.role}</p>
                <p className="mb-4 text-xs text-muted-foreground">
                  {artist.speciality}
                </p>
                <p className="text-sm text-foreground">{artist.bio}</p>

                <button className="mt-6 w-full border border-primary/30 py-2 text-sm text-primary transition-all hover:border-primary/60 hover:bg-primary/10">
                  Book
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Promoter Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-none"
        >
          <div className="mb-8 flex items-center justify-between">
            <h3 className="font-heading text-2xl text-foreground">
              <span className="text-primary">Promoter</span> Command
            </h3>
            <button className="bg-primary px-6 py-2 text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30">
              Login
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {promoterTools.map((tool, idx) => {
              const Icon = tool.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  className="glass-champagne rounded-none p-6"
                >
                  <Icon className="mb-4 h-8 w-8 text-primary" />
                  <h4 className="mb-2 font-heading text-lg text-foreground">
                    {tool.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                  <button className="mt-4 text-sm text-primary transition-colors hover:text-primary/70">
                    Access →
                  </button>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
