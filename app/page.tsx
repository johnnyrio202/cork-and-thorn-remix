import KineticHeroScroll from '@/components/KineticHeroScroll'
import { AboutSection } from '@/components/about-section'
import { VibeCheckModal } from '@/components/vibe-check-modal'
import { EthosSection } from '@/components/ethos-section'
import { MidnightGarden } from '@/components/midnight-garden'
import { ExperiencesSection } from '@/components/experiences-section'
import { CultureSection } from '@/components/culture-section'
import { getPublishedEvents, toEventItem } from '@/lib/content-data'

// Without this, Next prerenders this page once at build time (it has no
// per-request input to force dynamic rendering) — staff publishing a new
// event wouldn't show up here until the next deploy.
export const revalidate = 60

export default async function Home() {
  const events = (await getPublishedEvents()).map(toEventItem)

  return (
    <>
      <VibeCheckModal />
      <KineticHeroScroll />
      <AboutSection />
      <EthosSection />
      <MidnightGarden />
      <ExperiencesSection events={events} />
      <CultureSection />
    </>
  )
}
