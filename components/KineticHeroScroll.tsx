'use client'

import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform, useMotionValueEvent } from 'framer-motion'

// --- CDN CONFIGURATION ---
// 931-frame Ultra HD sequence. f_auto,q_auto compress the UHD files into
// lightweight formats on the fly to protect mobile bandwidth. Frames are
// named Frame001.jpg → Frame931.jpg (1-indexed, 3-digit zero padded).
const FRAME_COUNT = 931
const BASE_URL =
  'https://res.cloudinary.com/ifdhag4p/image/upload/f_auto,q_auto/v1784864573/Frame'
const EXTENSION = '.jpg'

// Aggressively preload only the opening frames so the first scroll is instant,
// then stream the rest on demand. This keeps peak memory + network bounded
// instead of instantiating all 931 UHD images at once (the old leak).
const EAGER_PRELOAD = 30
// How many frames ahead of the playhead to warm while scrubbing forward.
const LOOKAHEAD = 12

export default function KineticHeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Store frames in a ref (not state) so drawing never relies on a stale closure.
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)
  // Coalesce all draw requests within a single animation frame so momentum
  // scrolling never fires dozens of heavy UHD drawImage calls per frame.
  const drawRafRef = useRef(0)
  const targetFrameRef = useRef(0)

  // Manual scroll progress (0 → 1) computed from the container's position.
  // This avoids framer-motion's fragile useScroll({ target }) measurement,
  // which was pinning at 1 due to ancestor layout/containment.
  const progress = useMotionValue(0)

  const frameIndex = useTransform(progress, [0, 1], [0, FRAME_COUNT - 1])

  // Copy is visible from the first frame — no scroll-triggered fade-in so the
  // tagline is already in place when the page loads. Previously fading from 0
  // caused a visible "jump into position" on the first scroll event.
  const taglineOpacity = useTransform(progress, [0, 0], [1, 1])

  // Is a frame decoded and ready to paint?
  const isReady = (img?: HTMLImageElement) =>
    !!img && img.complete && img.naturalWidth > 0

  // Find nearest already-decoded frame so the canvas never flashes black.
  const nearestReadyIndex = (index: number) => {
    const frames = imagesRef.current
    if (isReady(frames[index])) return index
    for (let offset = 1; offset < FRAME_COUNT; offset++) {
      if (isReady(frames[index - offset])) return index - offset
      if (isReady(frames[index + offset])) return index + offset
    }
    return -1
  }

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const drawIndex = nearestReadyIndex(index)
    if (drawIndex === -1) return
    const img = imagesRef.current[drawIndex]
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height

    // Full "cover" zooms landscape frames in hard on tall mobile screens and
    // crops most of the width. On narrow viewports we blend the scale back
    // toward "contain" so more of each frame stays visible; desktop keeps
    // full cover. COVER_BIAS: 1 = full cover (max crop), 0 = contain (no crop).
    const cover = Math.max(w / img.naturalWidth, h / img.naturalHeight)
    const contain = Math.min(w / img.naturalWidth, h / img.naturalHeight)
    const isMobile = window.innerWidth < 768
    const COVER_BIAS = isMobile ? 0.8 : 1
    const scale = contain + (cover - contain) * COVER_BIAS

    // Horizontal: always center. Vertical: on mobile the reduced-crop scale
    // letterboxes the landscape frame, leaving dead space. Anchor to the TOP
    // (verticalAnchor 0) so the video fills right up under the hovering nav and
    // any leftover space falls to the bottom where it blends into the scroll.
    const verticalAnchor = isMobile ? 0 : 0.5
    const x = (w - img.naturalWidth * scale) / 2
    const y = (h - img.naturalHeight * scale) * verticalAnchor
    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale)
  }

  // Lazily instantiate + decode a single frame. Safe to call repeatedly; it
  // only ever creates one Image per index. Newly decoded frames repaint if the
  // playhead is sitting on/near them so the canvas fills in as data arrives.
  const loadFrame = (i: number) => {
    if (i < 0 || i >= FRAME_COUNT) return
    if (imagesRef.current[i]) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    // Array is 0-indexed internally; the CDN maps index 0 → Frame001 …
    // index 930 → Frame931, each zero-padded to 3 digits.
    const frameNumber = (i + 1).toString().padStart(3, '0')
    img.src = `${BASE_URL}${frameNumber}${EXTENSION}`
    img.onload = () => {
      if (i === 0) resizeCanvas()
      if (Math.abs(i - currentFrameRef.current) <= LOOKAHEAD) scheduleDraw()
    }
    imagesRef.current[i] = img
  }

  // Warm a forward-biased window around the playhead so scrubbing stays fed
  // without holding the entire sequence in memory.
  const warmWindow = (center: number) => {
    for (let offset = -2; offset <= LOOKAHEAD; offset++) {
      loadFrame(center + offset)
    }
  }

  // Draw at most once per animation frame, always painting the latest target.
  const scheduleDraw = () => {
    if (drawRafRef.current) return
    drawRafRef.current = requestAnimationFrame(() => {
      drawRafRef.current = 0
      drawFrame(targetFrameRef.current)
    })
  }

  // Size the canvas buffer to its rendered box (DPR-aware), then redraw.
  const resizeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    drawFrame(currentFrameRef.current)
  }

  // Aggressively preload ONLY the opening frames; the rest stream in on demand
  // via warmWindow() as the scroll position advances.
  useEffect(() => {
    imagesRef.current = new Array(FRAME_COUNT)
    for (let i = 0; i < EAGER_PRELOAD; i++) loadFrame(i)
    resizeCanvas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Compute scroll progress manually from the container's bounding box.
  // progress = distance scrolled into container / total scrollable distance.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      if (scrollable <= 0) {
        progress.set(0)
        return
      }
      // rect.top goes from 0 (at start) to -scrollable (at end).
      const p = Math.min(1, Math.max(0, -rect.top / scrollable))
      progress.set(p)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Only resize the canvas buffer on real width/orientation changes — NOT on
  // the constant height jitter from the mobile URL bar showing/hiding.
  useEffect(() => {
    let lastWidth = window.innerWidth
    const onResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth
        resizeCanvas()
      }
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', resizeCanvas)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', resizeCanvas)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Redraw the correct frame whenever the derived frame index changes.
  // The actual paint is deferred to a single rAF via scheduleDraw so a burst
  // of change events in one frame collapses into one UHD drawImage.
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const index = Math.round(latest)
    if (index === currentFrameRef.current) return
    currentFrameRef.current = index
    targetFrameRef.current = index
    // Stream the frames just ahead of the playhead, then paint.
    warmWindow(index)
    scheduleDraw()
  })

  // Cancel any pending draw on unmount.
  useEffect(() => {
    return () => {
      if (drawRafRef.current) cancelAnimationFrame(drawRafRef.current)
    }
  }, [])

  // Only the boxed keyword changes between chapters; the surrounding
  // "The way ... should be" copy stays constant. The tagline stays locked just
  // above where it was, slightly higher to cover the height of the drinking
  // glass being poured into (75%) across all scenes.
  const chapters = [
    { word: 'Nightlife', top: 75 },
    { word: 'the Sips', top: 75 },
    { word: 'the Exhales', top: 75 },
    { word: 'the Experiences', top: 75 },
  ]

  // Derive the active chapter from scroll progress so we render ONE keyword at
  // a time. That lets the box size to the word and the outer copy track it.
  const [activeIndex, setActiveIndex] = useState(0)
  useMotionValueEvent(progress, 'change', (p) => {
    const idx = p >= 0.85 ? 3 : p >= 0.56 ? 2 : p >= 0.26 ? 1 : 0
    setActiveIndex((prev) => (prev === idx ? prev : idx))
  })

  // Track mobile breakpoint so the tagline can ride higher (the frame is
  // top-anchored on mobile, so the glass sits higher than the desktop 75%).
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    // 300vh container gives ~200vh of scroll distance for 931 frames
    // (~1.8px per frame) so scrubbing stays smooth instead of jumping frames.
    <div
      ref={containerRef}
      className="relative w-full bg-[#0B111B] h-[300vh]"
    >
      <div className="sticky top-0 left-0 h-[100svh] w-full overflow-hidden">
        {/* CSS handles the aspect-ratio crop for vertical mobile screens,
            keeping the center anchored and slicing off the dead margins. */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Tagline overlay — outer copy is static; only the boxed keyword
            swaps on the scene cuts. The whole group animates vertically per
            scene so it sits on the glass while the bartender pours. The box
            sizes to the active word and the outer copy tracks it. */}
        {/* Tagline — on wide screens the three parts sit in a row; on small
            screens where the row would break they stack vertically:
            "The way" above / box in the middle / "should be" below, all
            center-aligned at every breakpoint. */}
        <motion.div
          style={{ opacity: taglineOpacity }}
          initial={{ top: `${isMobile ? 66 : chapters[0].top}%` }}
          animate={{ top: `${isMobile ? 66 : chapters[activeIndex].top}%` }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4 pointer-events-none z-40 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5 sm:gap-y-2 text-center"
        >
          <motion.span
            layout
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="font-script italic text-bone/85 text-4xl sm:text-5xl md:text-6xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-tight"
          >
            The way
          </motion.span>

          {/* Box hugs the active keyword and animates its width as words swap */}
          <motion.span
            layout
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-[#0B111B]/45 backdrop-blur-md border border-primary/50 px-6 sm:px-8 md:px-10 pt-2 pb-3 shadow-[0_0_40px_rgba(0,0,0,0.6)]"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={chapters[activeIndex].word}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="whitespace-nowrap font-sans font-semibold text-primary leading-[1.3] text-4xl sm:text-6xl md:text-7xl drop-shadow-[0_0_20px_rgba(226,182,54,0.7)]"
              >
                {chapters[activeIndex].word}
              </motion.span>
            </AnimatePresence>
          </motion.span>

          <motion.span
            layout
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="font-script italic text-bone/85 text-4xl sm:text-5xl md:text-6xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-tight"
          >
            should be
          </motion.span>
        </motion.div>

        <div className="absolute inset-0 pointer-events-none z-0 shadow-[inset_0_0_150px_rgba(11,17,27,1)]" />
      </div>
    </div>
  )
}
