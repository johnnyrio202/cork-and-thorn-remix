import KineticHeroScroll from '@/components/KineticHeroScroll'
import { AboutSection } from '@/components/about-section'
import { EventsStrip } from '@/components/v2/events-strip'
import { EntertainmentRoster } from '@/components/entertainment-roster'
import { FaqSection } from '@/components/v2/faq-section'
import { CultureSection } from '@/components/culture-section'

// Unlinked design preview — not part of the production homepage. Blends
// night-club's content structure (a residents/talent section, an FAQ block)
// into remix's existing hero, brand system, and real event/photo data. See
// /Users/riomain/.claude/plans/floating-weaving-willow.md for the reasoning.
export default function V2HomePage() {
  return (
    <>
      <KineticHeroScroll />
      <AboutSection />
      <EventsStrip />
      <EntertainmentRoster />
      <FaqSection />
      <CultureSection />
    </>
  )
}
