'use client'

import { motion } from 'framer-motion'

export function EthosSection() {
  return (
    <section className="relative w-full bg-[#0B111B] px-6 pt-[18px] pb-14">
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.2em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.35em' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="font-sans text-2xl sm:text-2xl md:text-2xl uppercase tracking-[0.35em] text-primary/80 mb-10 md:mb-14"
        >
          Cork ANd THORN
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
          className="font-lora text-2xl sm:text-3xl md:text-3xl leading-relaxed md:leading-[1.6] text-white text-balance"
        >
          Forget the manufactured neon of the Boulevard. Cork &amp; Thorn is where the city
          actually comes to play. We are an unapologetic, high-energy live music and hookah
          lounge planted right in the center of Las Vegas Arts District.{' '}
          <span className="text-2xl sm:text-3xl md:text-4xl text-[rgba(243,184,14,0.91)]">
            If you&apos;re looking for real culture, premium service, and a room full of people who
            actually know how to have a good time, you&apos;ve found it.
          </span>
        </motion.p>
      </div>
    </section>
  )
}
