'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.volume = 0
    }
  }, [])

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden">
      <video
        ref={videoRef}
        src="https://static.spotapps.co/website_videos/Cork_And_Thorn_Vimeo720p30.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-07-10%20at%203.11.34%E2%80%AFAM.png-0LJduv2q1mgzWIs715eKXBcsBE1Xsh.jpeg"
        alt="Cork and Thorn live entertainment stage with neon signage"
        fill
        priority
        className="absolute inset-0 h-full w-full object-cover hidden"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background/40 px-4 py-1.5 text-xs font-medium tracking-widest text-primary uppercase backdrop-blur">
            <MapPin className="h-3.5 w-3.5" /> Las Vegas, NV
          </p>
          <h1 className="font-heading text-6xl leading-[0.92] tracking-wide text-balance sm:text-7xl lg:text-8xl">
            Where nightlife
            <br />
            <span className="text-secondary neon-text-secondary">comes alive</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
            Premium hookah, masterful craft cocktails, and live R&amp;B and
            hip-hop every night. An intimate, upscale escape built for date
            nights and unforgettable nightlife.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/reservations" />}
              size="lg"
              className="shadow-glow-primary"
            >
              Reserve a Table
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/events" />}
              size="lg"
              variant="outline"
            >
              View Events
            </Button>
          </div>
          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
            {[
              { label: 'Live Music', value: 'Nightly' },
              { label: 'Hookah Flavors', value: '20+' },
              { label: 'Crowd Rating', value: '4.9★' },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="font-heading text-3xl text-foreground">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
