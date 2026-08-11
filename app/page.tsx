import KineticHeroScroll from '@/components/KineticHeroScroll'
import { AboutSection } from '@/components/about-section'
import { VibeCheckModal } from '@/components/vibe-check-modal'
import { EthosSection } from '@/components/ethos-section'
import { MidnightGarden } from '@/components/midnight-garden'
import { ExperiencesSection } from '@/components/experiences-section'
import { CultureSection } from '@/components/culture-section'

export default function Home() {
  return (
    <>
      <VibeCheckModal />
      <KineticHeroScroll />
      <AboutSection />
      <EthosSection />
      <MidnightGarden />
      <ExperiencesSection />
      <CultureSection />
    </>
  )
}
