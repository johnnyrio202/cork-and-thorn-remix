'use client'

import { ExperiencePortal } from '@/components/experience-portal'

export default function EventDetailPage() {
  return (
    <ExperiencePortal
      onRSVPClick={() => console.log('[v0] RSVP clicked — wire to AuthGate')}
      onTableClick={() => console.log('[v0] Table clicked — wire to FloorPlan')}
    />
  )
}
