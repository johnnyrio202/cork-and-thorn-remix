'use client'

import { useRef, useState } from 'react'
import { ExperiencesLineup } from '@/components/experiences-lineup'
import { ReservationForm } from '@/components/reservations/reservation-form'
import { SpatialBooking } from '@/components/spatial-booking'
import { motion } from 'framer-motion'
export default function ExperiencesPage() {
  const [prefilledDate, setPrefilledDate] = useState<string | undefined>()
  const formRef = useRef<HTMLElement>(null)

  function handleSecureTable(_day: unknown) {
    setPrefilledDate(undefined) // call sheet days don't carry dates; scroll to form
    // Give React a tick to update the date, then scroll to the form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  return (
    <>
      {/* Spacer so content clears the top nav */}
      <div className="pt-16" />

      {/* Weekly lineup */}
      <ExperiencesLineup
        onRSVPClick={handleSecureTable}
        onTableClick={handleSecureTable}
      />

      {/* Divider */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-6">
        <div className="flex items-center gap-6">
          <div className="flex-1 h-px bg-white/[0.07]" />
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="font-sans text-[9px] uppercase tracking-[0.5em] text-primary/50 mb-1">
              Secure Your Seat
            </p>
            <h2 className="font-sans text-2xl md:text-3xl font-bold text-white">
              Reserve Your Night
            </h2>
          </motion.div>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>
        <p className="mt-3 text-center font-sans text-sm text-white/40 max-w-md mx-auto">
          Pick your table tier, add bottle service, and lock in with a deposit that
          goes straight toward your tab.
        </p>
      </div>

      {/* Interactive floor plan */}
      <div className="mx-auto max-w-7xl">
        <SpatialBooking />
      </div>

      {/* Divider */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-4">
        <div className="h-px bg-white/[0.07]" />
      </div>

      {/* Reservation form — receives the date selected from the calendar above */}
      <ReservationForm prefilledDate={prefilledDate} formRef={formRef} />
    </>
  )
}
