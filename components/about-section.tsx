'use client'

import { useEffect, useRef, useState } from 'react'

export function AboutSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  // React doesn't reliably set the muted DOM property via the JSX attribute.
  // Setting it directly on the element guarantees the browser honours it.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.volume = 0
    }
  }, [])

  // Don't start loading/playing this 9MB video until it's actually scrolled
  // into view. Firing it unconditionally on mount had it competing for
  // bandwidth/main-thread with the hero's frame-sequence canvas immediately
  // above it, which left the video stuck at readyState 0 indefinitely (and
  // in one observed case, calling .play() on it while the hero was still
  // active froze the tab for tens of seconds).
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || !videoRef.current) return
    const video = videoRef.current
    video.load()
    video.play().catch(() => {
      // Autoplay can still be blocked by browser policy in some contexts;
      // the poster image covers that case so nothing is left blank.
    })
  }, [inView])

  return (
    <section className="relative z-10 w-full spacing-fluid bg-[#0B111B] pl-[45px] pr-[29px] pb-0 -mt-[16vh] md:mt-0">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-sans text-primary text-xl sm:text-2xl md:text-3xl mb-16 md:mb-[63px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-center">
          a Vegas curated Social
        </h2>

        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-2xl border border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.6)] mb-8 md:mb-12"
        >
          <video
            ref={videoRef}
            className="w-full h-auto"
            poster="/images/venue-bar.jpeg"
            src={inView ? '/videos/cork-and-thorn-brand.mp4' : undefined}
            muted
            loop
            playsInline
            preload="none"
          />
        </div>
      </div>
    </section>
  )
}
