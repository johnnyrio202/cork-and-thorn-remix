'use client'

import React, { useEffect, useState } from 'react'
import { Check, Users, Wine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { tableTiers, bottleService, NIGHTLIFE_SLOT, isNightlifeSlot } from '@/lib/data'
import { cn } from '@/lib/utils'

interface ReservationFormProps {
  prefilledDate?: string
  formRef?: React.RefObject<HTMLElement>
}

export function ReservationForm({ prefilledDate, formRef }: ReservationFormProps = {}) {
  const [tierId, setTierId] = useState(tableTiers[1].id)
  const [bottles, setBottles] = useState<string[]>([])
  const [date, setDate] = useState(prefilledDate ?? '')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState('4')
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [requestConfirmed, setRequestConfirmed] = useState(false)

  // Sync when parent passes a new prefilled date (calendar selection)
  useEffect(() => {
    if (prefilledDate) setDate(prefilledDate)
  }, [prefilledDate])

  const tier = tableTiers.find((t) => t.id === tierId)!
  const nightlife = isNightlifeSlot(date, time)
  const depositAmount = nightlife ? NIGHTLIFE_SLOT.depositAmount : 0

  function toggleBottle(name: string) {
    setBottles((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name],
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId,
          date,
          time,
          partySize: Number(guests),
          guestName,
          guestPhone,
          guestEmail,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? 'Unable to complete reservation')
      }
      if (data.href) {
        window.location.href = data.href
        return // keep isSubmitting true — page is navigating away
      }
      setRequestConfirmed(true)
      setIsSubmitting(false)
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Unable to complete reservation',
      )
      setIsSubmitting(false)
    }
  }

  return (
    <section ref={formRef as React.RefObject<HTMLElement> | undefined} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          {/* Table tiers */}
          <div>
            <h2 className="font-heading text-3xl tracking-wide">
              1. Choose Your Table
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {tableTiers.map((t) => {
                const active = t.id === tierId
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setTierId(t.id)}
                    className={cn(
                      'flex flex-col rounded-2xl border p-5 text-left transition-colors',
                      active
                        ? 'border-primary bg-primary/10 shadow-glow-primary'
                        : 'border-border bg-card hover:border-primary/50',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xl tracking-wide">
                        {t.name}
                      </span>
                      {active && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <span className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> {t.capacity}
                    </span>
                    <span className="mt-3 font-heading text-2xl">
                      ${t.minSpend}
                      <span className="text-sm font-normal text-muted-foreground">
                        {' '}
                        minimum spend
                      </span>
                    </span>
                    <ul className="mt-3 flex flex-col gap-1.5 border-t border-border/60 pt-3">
                      {t.perks.map((perk) => (
                        <li
                          key={perk}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground"
                        >
                          <Check className="h-3 w-3 shrink-0 text-primary" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Date / time / party */}
          <div>
            <h2 className="font-heading text-3xl tracking-wide">
              2. Date &amp; Party
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="res-date">Date</Label>
                <Input
                  id="res-date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-card"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="res-time">Arrival time</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger id="res-time" className="bg-card">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {['9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM', '2:00 AM'].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="res-guests">Guests</Label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger id="res-guests" className="bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? 'guest' : 'guests'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Bottle service */}
          <div>
            <h2 className="font-heading text-3xl tracking-wide">
              3. Bottle Service{' '}
              <span className="text-base font-normal text-muted-foreground">
                (optional)
              </span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pre-select bottles to add to your deposit and skip the wait.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {bottleService.map((b) => {
                const active = bottles.includes(b.name)
                return (
                  <button
                    type="button"
                    key={b.name}
                    onClick={() => toggleBottle(b.name)}
                    className={cn(
                      'flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors',
                      active
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/50',
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <Wine
                        className={cn(
                          'h-4 w-4',
                          active ? 'text-primary' : 'text-muted-foreground',
                        )}
                      />
                      <span className="text-sm font-medium">{b.name}</span>
                    </span>
                    <span className="font-heading text-lg">${b.price}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-heading text-3xl tracking-wide">
              4. Your Details
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="res-name">Full name</Label>
                <Input
                  id="res-name"
                  required
                  placeholder="Your name"
                  className="bg-card"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="res-phone">Phone</Label>
                <Input
                  id="res-phone"
                  type="tel"
                  required
                  placeholder="(725) 000-0000"
                  className="bg-card"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="res-email">Email</Label>
                <Input
                  id="res-email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="bg-card"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-heading text-2xl tracking-wide">
              Reservation Summary
            </h3>
            <dl className="mt-5 flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Table</dt>
                <dd className="font-medium">{tier.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Minimum spend</dt>
                <dd>${tier.minSpend}</dd>
              </div>
              {bottles.length > 0 && (
                <div className="border-t border-border pt-3">
                  <dt className="mb-2 text-muted-foreground">
                    Bottles requested{' '}
                    <span className="text-xs">(arranged with your host, not charged online)</span>
                  </dt>
                  {bottles.map((name) => {
                    const b = bottleService.find((x) => x.name === name)!
                    return (
                      <div
                        key={name}
                        className="flex justify-between py-0.5 text-sm"
                      >
                        <span>{name}</span>
                        <span>${b.price}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </dl>

            {nightlife && (
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">
                  Deposit due today
                </span>
                <span className="font-heading text-3xl text-primary">
                  ${depositAmount}
                </span>
              </div>
            )}

            {requestConfirmed ? (
              <div className="mt-5 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-center text-sm">
                Reservation confirmed — see you then!
              </div>
            ) : (
              <Button
                type="submit"
                onClick={handleSubmit}
                size="lg"
                disabled={isSubmitting}
                className="mt-5 w-full shadow-glow-primary"
              >
                {isSubmitting
                  ? nightlife
                    ? 'Redirecting…'
                    : 'Reserving…'
                  : nightlife
                    ? `Reserve & Pay $${depositAmount} Deposit`
                    : 'Reserve Table'}
              </Button>
            )}
            {submitError && (
              <p className="mt-2 text-center text-sm text-destructive">{submitError}</p>
            )}
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {nightlife
                ? `This $${depositAmount} deposit is non-refundable if you no-show, and is applied to your table's spend the night of your reservation.`
                : 'No deposit required for this reservation.'}
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
