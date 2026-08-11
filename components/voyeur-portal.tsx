'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Radio } from 'lucide-react'
import Image from 'next/image'

export function VoyeurPortal() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.volume = 0
    }
  }, [])

  const votes = [
    { label: 'Next DJ Set', percentage: 68 },
    { label: 'Feature Live Music', percentage: 45 },
    { label: 'Special Event', percentage: 82 },
    { label: 'New Cocktail Drop', percentage: 55 },
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
            <span className="text-primary">The Voyeur</span> Portal
          </h2>
          <p className="text-lg text-muted-foreground">
            Live streams, voting, and real-time venue pulse
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Live Stream PiP */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="glass-dark relative aspect-video overflow-hidden rounded-none">
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/images/venue-stage.jpeg"
              >
                <source src="/videos/cork-and-thorn.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20" />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/70 px-4 py-2 backdrop-blur-sm"
              >
                <Radio className="h-4 w-4 animate-pulse text-primary" />
                <span className="text-sm font-medium text-primary">LIVE</span>
              </motion.div>
            </div>

            {/* Picture-in-Picture secondary cams */}
            <div className="mt-4 flex gap-4">
              {[
                { label: 'Main Bar', src: '/images/venue-bar.jpeg' },
                { label: 'Hookah Lounge', src: '/images/venue-hookah.jpeg' },
              ].map((cam) => (
                <div
                  key={cam.label}
                  className="glass-light relative aspect-video flex-1 overflow-hidden rounded-none"
                >
                  <Image
                    src={cam.src || '/placeholder.svg'}
                    alt={`${cam.label} camera feed`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-background/20" />
                  <span className="absolute bottom-2 left-2 rounded bg-background/70 px-2 py-1 text-xs text-foreground backdrop-blur-sm">
                    {cam.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Voting Matrix */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-champagne space-y-6 rounded-none p-6"
          >
            <h3 className="font-heading text-xl text-primary">The Pulse</h3>
            <p className="text-sm text-muted-foreground">
              Vote on what happens next at Cork and Thorn
            </p>

            <div className="space-y-4">
              {votes.map((vote, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="mb-2 flex justify-between">
                    <label className="text-sm text-foreground">{vote.label}</label>
                    <span className="text-sm text-primary">{vote.percentage}%</span>
                  </div>
                  <div className="glass-light relative h-2 overflow-hidden rounded-full">
                    <motion.div
                      initial={{ width: '0%' }}
                      whileInView={{ width: `${vote.percentage}%` }}
                      transition={{ duration: 1, delay: idx * 0.15 }}
                      className="h-full bg-gradient-to-r from-primary to-primary/60"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full bg-primary py-2 text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30">
              Vote Now
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
