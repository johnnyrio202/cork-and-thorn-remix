'use client'

import { useEffect, useRef, useState } from 'react'
import { ExperiencesLineup } from '@/components/experiences-lineup'
import { ReservationForm } from '@/components/reservations/reservation-form'
import { SpatialBooking, type AvailabilityMap } from '@/components/spatial-booking'
import { ReservationDatePicker } from '@/components/reservations/date-picker'
import type { Booth } from '@/lib/data'
import { motion } from 'framer-motion'

export default function ExperiencesPage() {
  const [date, setDate] = useState('')
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null)
  const [availability, setAvailability] = useState<AvailabilityMap>({})
  const formRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!date) {
      setAvailability({})
      return
    }
    let cancelled = false
    fetch(`/api/availability?date=${date}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setAvailability(data)
      })
    return () => {
      cancelled = true
    }
  }, [date])

  function scrollToForm() {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  function handleSecureTable(_day: unknown) {
    scrollToForm()
  }

  function handleSelectBooth(booth: Booth) {
    setSelectedBooth(booth)
    scrollToForm()
  }

  function handleDateChange(next: string) {
    setDate(next)
    setSelectedBooth(null)
  }

  function handleBookingComplete() {
    setSelectedBooth(null)
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
          Pick a date, then choose your table on the floor plan below.
        </p>
        <div className="mx-auto mt-6 max-w-xs">
          <ReservationDatePicker value={date} onChange={handleDateChange} />
        </div>
      </div>

      {/* Interactive floor plan */}
      <div className="mx-auto max-w-7xl">
        <SpatialBooking
          date={date}
          availability={availability}
          selectedBoothId={selectedBooth?.id}
          onSelectBooth={handleSelectBooth}
        />
      </div>

      {/* Divider */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-4">
        <div className="h-px bg-white/[0.07]" />
      </div>

      {/* Reservation form — receives the date and booth selected above */}
      <ReservationForm
        date={date}
        booth={selectedBooth}
        formRef={formRef}
        onBookingComplete={handleBookingComplete}
      />
    </>
  )
}
