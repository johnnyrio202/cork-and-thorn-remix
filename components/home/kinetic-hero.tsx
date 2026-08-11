'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

// Configuration
const FRAME_COUNT = 881 // 881 Total High-Fidelity Frames
const FOLDER_PATH = '/cork_hero_frames/frame_'
const EXTENSION = '.jpg'

export function KineticHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])

  // 1. Framer Motion Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['top top', 'bottom bottom'],
  })

  // Map scroll progress (0 to 1) to our frame count
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1])

  // Map scroll progress to our Glassmorphic Chapter Words
  const chapterOpacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.25], [0, 1, 1, 0]) // NIGHTLIFE
  const chapterOpacity2 = useTransform(scrollYProgress, [0.25, 0.35, 0.45, 0.5], [0, 1, 1, 0]) // SIPS
  const chapterOpacity3 = useTransform(scrollYProgress, [0.5, 0.6, 0.7, 0.75], [0, 1, 1, 0]) // EXHALES
  const chapterOpacity4 = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1], [0, 1, 1, 0]) // EXPERIENCES

  // 2. Preload Images for Zero-Lag Scrubbing
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = []
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      // formats numbers like 000, 001, 010, 150... up to 880
      const formattedNumber = i.toString().padStart(3, '0')
      img.src = `${FOLDER_PATH}${formattedNumber}${EXTENSION}`
      loadedImages.push(img)
    }
    setImages(loadedImages)
  }, [])

  // 3. Draw to Canvas on Scroll
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    if (!canvasRef.current || images.length === 0) return
    const ctx = canvasRef.current.getContext('2d')
    const index = Math.round(latest)
    const img = images[index]

    if (img && img.complete) {
      // Ensure canvas matches screen resolution
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight

      // Draw image covering the whole canvas (object-fit: cover logic)
      const scale = Math.max(
        window.innerWidth / img.width,
        window.innerHeight / img.height
      )
      const x = window.innerWidth / 2 - (img.width / 2) * scale
      const y = window.innerHeight / 2 - (img.height / 2) * scale

      ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx?.drawImage(img, x, y, img.width * scale, img.height * scale)
    }
  })

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-background"
      style={{ height: '400vh' }}
    >
      {/* Sticky Container holds the Canvas and UI on screen while scrolling */}
      <div className="sticky top-0 left-0 h-screen w-full overflow-hidden">
        {/* The Hardware-Accelerated Video Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* The Glassmorphic Overlay Layer */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <motion.h1
            style={{ opacity: chapterOpacity1 }}
            className="absolute text-5xl md:text-8xl font-black text-white/80 tracking-widest uppercase backdrop-blur-md px-8 py-4 rounded-xl border border-white/10 shadow-2xl"
          >
            NIGHTLIFE.
          </motion.h1>

          <motion.h1
            style={{ opacity: chapterOpacity2 }}
            className="absolute text-5xl md:text-8xl font-black text-white/80 tracking-widest uppercase backdrop-blur-md px-8 py-4 rounded-xl border border-white/10 shadow-2xl"
          >
            SIPS.
          </motion.h1>

          <motion.h1
            style={{ opacity: chapterOpacity3 }}
            className="absolute text-5xl md:text-8xl font-black text-white/80 tracking-widest uppercase backdrop-blur-md px-8 py-4 rounded-xl border border-white/10 shadow-2xl"
          >
            EXHALES.
          </motion.h1>

          <motion.h1
            style={{ opacity: chapterOpacity4 }}
            className="absolute text-5xl md:text-8xl font-black text-white/80 tracking-widest uppercase backdrop-blur-md px-8 py-4 rounded-xl border border-white/10 shadow-2xl"
          >
            EXPERIENCES.
          </motion.h1>
        </div>

        {/* The Vignette Bleed (Fades edges into the Noir background) */}
        <div className="absolute inset-0 pointer-events-none z-0 shadow-[inset_0_0_150px_rgba(11,17,27,1)]" />
      </div>
    </div>
  )
}
