import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHeader } from '@/components/page-header'
import { PartyInquiryForm } from '@/components/private-parties/party-inquiry-form'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Private Parties & Events',
  description:
    'Host your next celebration at Cork & Thorn. Private parties, corporate events, birthdays, and bottle service packages in the heart of Las Vegas.',
}

const perks = [
  'Dedicated event coordinator from booking to last call',
  'Custom hookah, cocktail, and bottle service packages',
  'Live DJ or curated R&B / hip-hop playlist',
  'Reserved VIP sections and full venue buyouts',
  'Bespoke food and small-bites menus',
  'Personalized décor, signage, and lighting',
]

export default function PrivatePartiesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Private Events"
        title="Throw Your Night Here"
        description="From intimate birthday celebrations to full venue buyouts, our team curates unforgettable nights with premium hookah, craft cocktails, and live entertainment."
      />

      <section className="px-4 pb-12 md:pb-20">
        <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
              <Image
                src="/images/parties.png"
                alt="Guests celebrating with bottle service at a private party in Cork and Thorn"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="font-serif text-lg text-foreground md:text-xl">
                {'What\u2019s Included'}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <PartyInquiryForm />
        </div>
      </section>
    </main>
  )
}
