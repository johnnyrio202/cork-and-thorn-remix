'use client'

import { useEffect, useRef } from 'react'

export function AboutSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // React doesn't reliably set the muted DOM property via the JSX attribute.
    // Setting it directly on the element guarantees the browser honours it.
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.volume = 0
    }
  }, [])

  return (
    <section className="relative z-10 w-full spacing-fluid bg-[#0B111B] pl-[45px] pr-[29px] pb-0 -mt-[16vh] md:mt-0">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-sans text-primary text-xl sm:text-2xl md:text-3xl mb-16 md:mb-[63px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-center">
          a Vegas curated Social
        </h2>

        <div className="relative overflow-hidden rounded-2xl border border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.6)] mb-8 md:mb-12">
          <video
            ref={videoRef}
            className="w-full h-auto"
            src="/videos/cork-and-thorn-brand.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      </div>
    </section>
  )
}
