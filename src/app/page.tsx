import Image from "next/image";
import Link from "next/link";
import { siteInfo, weeklyLineup, happyHour, reservationTiers } from "@/data/site";

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden px-4 py-24 text-center sm:px-6 sm:py-32">
        <div className="pointer-events-none absolute inset-0 -z-10 h-1 neon-divider" />
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          A Vegas Curated Social
        </p>
        <h1 className="font-display mx-auto mt-6 max-w-4xl text-5xl leading-tight text-gold-bright sm:text-7xl">
          Cork and Thorn
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-2xl text-muted">
          The way <span className="text-gold-bright">Nightlife</span> should be
        </p>
        <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {siteInfo.about}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/reservations"
            className="rounded-full bg-gold-bright px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90"
          >
            Reserve Your Night
          </Link>
          <Link
            href="/menu"
            className="rounded-full border border-panel-border px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-gold/60"
          >
            View Menu
          </Link>
        </div>
      </section>

      <section className="border-t border-panel-border px-4 py-6 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          The Midnight Garden
        </p>
      </section>

      <section className="grid grid-cols-2 gap-1 sm:grid-cols-4">
        {[
          { src: "/images/venue-stage.jpg", alt: "Live band on stage" },
          { src: "/images/venue-bar.jpg", alt: "Bar counter" },
          { src: "/images/venue-hookah.jpg", alt: "Hookah station" },
          { src: "/images/performer-mic.jpg", alt: "Performer with mic" },
        ].map((img) => (
          <div key={img.src} className="relative aspect-square">
            <Image src={img.src} alt={img.alt} fill className="object-cover" />
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Sips & Exhales
        </p>
        <h2 className="font-display mt-3 text-3xl sm:text-4xl">
          Craft cocktails, curated bottles, premium hookah
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { title: "The Blooms", desc: "Floral, aromatic craft cocktails built to impress." },
            { title: "The Roots", desc: "Earthy, spirit-forward classics with a Cork & Thorn twist." },
            { title: "The Mock Garden", desc: "Zero-proof botanicals for the clear-headed crowd." },
          ].map((c) => (
            <div key={c.title} className="rounded-xl border border-panel-border bg-panel p-6">
              <h3 className="font-display text-xl text-gold-bright">{c.title}</h3>
              <p className="mt-2 text-sm text-muted">{c.desc}</p>
              <Link href="/menu" className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                View Menu →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-panel-border bg-panel px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            The Experiences
          </p>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl">Live & In The Room</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-panel-border bg-background p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                Live Music
              </p>
              {weeklyLineup.map((event) => (
                <div key={event.title} className="mt-2">
                  <h3 className="font-display text-xl">{event.title}</h3>
                  <p className="text-sm text-muted">
                    {event.performer} · {event.day}, {event.time}
                  </p>
                </div>
              ))}
              <div className="mt-4 border-t border-panel-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                  {happyHour.label}
                </p>
                <p className="text-sm text-muted">
                  {happyHour.time} · {happyHour.description}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-panel-border bg-background p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                VIP Group Bottle Service
              </p>
              <p className="mt-2 text-sm text-muted">
                Reserve your section before the night fills up. Premium bottle
                packages, dedicated service, and the best view in the room —
                available every Friday and Saturday after 11 PM.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                {reservationTiers.map((t) => (
                  <div key={t.slug} className="rounded-lg border border-panel-border p-3">
                    <p className="font-semibold text-gold-bright">{t.name}</p>
                    <p className="mt-1 text-muted">{t.minimum}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/reservations"
                className="mt-4 inline-block rounded-full bg-gold-bright px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-background"
              >
                Select Your Table
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          The Culture
        </p>
        <h2 className="font-display mt-3 text-3xl sm:text-4xl">Join The Movement</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-panel-border bg-panel p-6">
            <h3 className="font-display text-xl text-gold-bright">The Inner Circle</h3>
            <p className="mt-2 text-sm text-muted">
              Unapologetic excellence. Member rewards, priority access, and
              off-menu perks. Loyalty login for the regulars who make this
              room what it is.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              Coming Soon
            </p>
          </div>
          <div className="rounded-xl border border-panel-border bg-panel p-6">
            <h3 className="font-display text-xl text-gold-bright">Apparel / Merch</h3>
            <p className="mt-2 text-sm text-muted">
              Wear the after-hours. Limited drops.
            </p>
            <Link href="/shop" className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              Shop Now →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
