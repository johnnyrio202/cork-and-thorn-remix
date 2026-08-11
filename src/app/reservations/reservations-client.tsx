"use client";

import { useState } from "react";
import {
  reservationTiers,
  bottleAddOns,
  floorPlanZones,
  weeklyLineup,
  happyHour,
} from "@/data/site";

export function ReservationsClient() {
  const [selectedTier, setSelectedTier] = useState(reservationTiers[1].slug);
  const tier = reservationTiers.find((t) => t.slug === selectedTier)!;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        Live & In The Room
      </p>
      <h1 className="font-display mt-3 text-center text-4xl sm:text-5xl">Weekly Line Up</h1>

      <div className="mt-10 rounded-xl border border-panel-border bg-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
          Live Music
        </p>
        {weeklyLineup.map((event) => (
          <div key={event.title} className="mt-2">
            <h3 className="font-display text-2xl text-gold-bright">{event.title}</h3>
            <p className="text-sm text-muted">
              {event.performer} · {event.day}, {event.time}
            </p>
            <button className="mt-3 rounded-full bg-gold-bright px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-background">
              RSVP
            </button>
          </div>
        ))}
        <div className="mt-6 border-t border-panel-border pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
            {happyHour.label} · Every Day
          </p>
          <p className="text-sm text-muted">
            {happyHour.time} · {happyHour.description}
          </p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Secure Your Seat
        </p>
        <h2 className="font-display mt-3 text-3xl sm:text-4xl">Reserve Your Night</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
          Pick your table tier, add bottle service, and lock in with a
          deposit that goes straight toward your tab.
        </p>
      </div>

      <div className="mt-10">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.15em] text-gold">
          Interactive Floor Plan
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {floorPlanZones.map((z) => (
            <div key={z.zone} className="rounded-xl border border-panel-border bg-panel p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-gold-bright">
                {z.zone}
              </p>
              <div className="flex flex-wrap gap-2">
                {z.tables.map((t) => (
                  <span
                    key={t.name}
                    className="rounded-lg border border-panel-border px-3 py-2 text-xs text-muted"
                    title={t.capacity}
                  >
                    {t.name}
                    <span className="ml-1 text-gold/70">· {t.capacity}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.15em] text-gold">
          1. Choose Your Table
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {reservationTiers.map((t) => (
            <button
              key={t.slug}
              onClick={() => setSelectedTier(t.slug)}
              className={`rounded-xl border p-5 text-left transition-colors ${
                selectedTier === t.slug
                  ? "border-gold-bright bg-panel"
                  : "border-panel-border bg-panel/40 hover:border-gold/40"
              }`}
            >
              <h3 className="font-display text-xl text-gold-bright">{t.name}</h3>
              <p className="mt-1 text-sm text-muted">{t.guests}</p>
              <p className="mt-3 text-sm">{t.deposit}</p>
              <p className="text-sm text-muted">{t.minimum}</p>
              <ul className="mt-3 space-y-1 text-xs text-muted">
                {t.perks.map((p) => (
                  <li key={p}>· {p}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.15em] text-gold">
          2. Date & Party
        </p>
        <div className="grid gap-4 rounded-xl border border-panel-border bg-panel p-6 sm:grid-cols-3">
          <label className="text-xs text-muted">
            Date
            <input type="date" className="mt-1 w-full rounded-lg border border-panel-border bg-background px-3 py-2 text-sm text-foreground" />
          </label>
          <label className="text-xs text-muted">
            Arrival time
            <select className="mt-1 w-full rounded-lg border border-panel-border bg-background px-3 py-2 text-sm text-foreground">
              <option>Select</option>
            </select>
          </label>
          <label className="text-xs text-muted">
            Guests
            <input type="number" defaultValue={4} className="mt-1 w-full rounded-lg border border-panel-border bg-background px-3 py-2 text-sm text-foreground" />
          </label>
        </div>
      </div>

      <div className="mt-12">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.15em] text-gold">
          3. Bottle Service (optional)
        </p>
        <p className="mb-4 text-center text-sm text-muted">
          Pre-select bottles to add to your deposit and skip the wait.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {bottleAddOns.map((b) => (
            <label key={b.name} className="flex items-center justify-between rounded-lg border border-panel-border bg-panel px-4 py-3 text-sm">
              <span className="flex items-center gap-2">
                <input type="checkbox" className="accent-[var(--gold-bright)]" />
                {b.name}
              </span>
              <span className="text-gold-bright">{b.price}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.15em] text-gold">
          4. Your Details
        </p>
        <div className="grid gap-4 rounded-xl border border-panel-border bg-panel p-6 sm:grid-cols-3">
          <input placeholder="Full name" className="rounded-lg border border-panel-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted" />
          <input placeholder="Phone" className="rounded-lg border border-panel-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted" />
          <input placeholder="Email" className="rounded-lg border border-panel-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted" />
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-gold/30 bg-panel p-6">
        <h3 className="font-display text-xl text-gold-bright">Reservation Summary</h3>
        <div className="mt-3 space-y-1 text-sm">
          <p className="flex justify-between"><span className="text-muted">Table</span><span>{tier.name}</span></p>
          <p className="flex justify-between"><span className="text-muted">Table deposit</span><span>{tier.deposit.replace(" deposit", "")}</span></p>
          <p className="flex justify-between"><span className="text-muted">Minimum spend</span><span>{tier.minimum.replace(" minimum spend", "")}</span></p>
          <p className="flex justify-between font-semibold text-gold-bright"><span>Deposit due today</span><span>{tier.deposit.replace(" deposit", "")}</span></p>
        </div>
        <button className="mt-5 w-full rounded-full bg-gold-bright py-3 text-xs font-semibold uppercase tracking-[0.15em] text-background">
          Reserve & Pay Deposit
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          Deposit applies to your final tab. Fully refundable up to 48 hours
          before your reservation.
        </p>
        <p className="mt-4 text-center text-xs text-muted/70">
          Payment processing not yet connected — this form is a frontend
          preview only.
        </p>
      </div>
    </div>
  );
}
