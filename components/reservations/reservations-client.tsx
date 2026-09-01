'use client'

import { useState } from 'react'
import { ExperiencesLineup } from '@/components/experiences-lineup'
import { BookingWizard } from '@/components/reservations/booking-wizard'
import type { EventItem } from '@/lib/data'

export function ReservationsClient({ events }: { events: EventItem[] }) {
  const [prefill, setPrefill] = useState<{ date: string; time: string } | null>(null)

  function scrollToWizard() {
    setTimeout(() => {
      document.getElementById('booking-wizard')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  function handleRSVPClick(_event: EventItem) {
    scrollToWizard()
  }

  // The lineup already knows the event's real date + time, and already
  // gates this button to the Nightlife-eligible slot — use it instead of
  // discarding it and starting the wizard from scratch.
  function handleTableClick(event: EventItem) {
    setPrefill({ date: event.date, time: event.time })
    scrollToWizard()
  }

  return (
    <>
      {/* Spacer so content clears the top nav */}
      <div className="pt-16" />

      {/* Weekly lineup */}
      <ExperiencesLineup events={events} onRSVPClick={handleRSVPClick} onTableClick={handleTableClick} />

      {/* Divider */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-4">
        <div className="h-px bg-white/[0.07]" />
      </div>

      {/* Step-by-step booking wizard */}
      <BookingWizard prefillDate={prefill?.date} prefillTime={prefill?.time} />
    </>
  )
}
