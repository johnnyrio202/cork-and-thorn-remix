import { ReservationsClient } from '@/components/reservations/reservations-client'
import { getPublishedEvents, toEventItem } from '@/lib/content-data'

// See app/page.tsx for why this is needed — same static-prerender gap.
export const revalidate = 60

export default async function ExperiencesPage() {
  const events = (await getPublishedEvents()).map(toEventItem)
  return <ReservationsClient events={events} />
}
