'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { tableTiers, NIGHTLIFE_SLOT, isNightlifeSlot, type Booth } from '@/lib/data'

interface ReservationFormProps {
  date: string
  time: string
  booth: Booth
  partySize: number
  bottles: string[]
  onBookingComplete?: () => void
}

export function ReservationForm({
  date,
  time,
  booth,
  partySize,
  bottles,
  onBookingComplete,
}: ReservationFormProps) {
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [requestConfirmed, setRequestConfirmed] = useState(false)

  const tier = tableTiers.find((t) => t.id === booth.tier)!
  const nightlife = isNightlifeSlot(date, time)
  const depositAmount = nightlife ? NIGHTLIFE_SLOT.depositAmount : 0
  const canSubmit = guestName.trim() && guestPhone.trim() && guestEmail.trim()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    if (!canSubmit) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boothId: booth.id,
          date,
          time,
          partySize,
          guestName,
          guestPhone,
          guestEmail,
          notes: notes.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        // 409 (table just taken) is user-actionable and worth showing verbatim;
        // anything else gets a friendly fallback instead of a raw API string.
        throw new Error(res.status === 409 ? data.error : 'Something went wrong — please check your details and try again.')
      }
      if (data.href) {
        window.location.href = data.href
        return // keep isSubmitting true — page is navigating away
      }
      setRequestConfirmed(true)
      setIsSubmitting(false)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong — please try again.')
      setIsSubmitting(false)
    }
  }

  if (requestConfirmed) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <div className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm">
          Reservation confirmed — see you then!
        </div>
        <Button variant="outline" onClick={onBookingComplete}>
          Book Another
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="rounded-xl border border-border bg-card p-4 text-sm">
        <div className="flex justify-between py-1">
          <span className="text-muted-foreground">Table</span>
          <span className="font-medium">{booth.name}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium">{date}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-muted-foreground">Time</span>
          <span className="font-medium">{time}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-muted-foreground">Guests</span>
          <span className="font-medium">{partySize}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-muted-foreground">Minimum spend</span>
          <span className="font-medium">${tier.minSpend}</span>
        </div>
        {bottles.length > 0 && (
          <div className="border-t border-border mt-2 pt-2">
            <p className="text-muted-foreground mb-1">Bottles requested</p>
            {bottles.map((name) => (
              <p key={name} className="text-xs">{name}</p>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="res-name">Full name</Label>
          <Input
            id="res-name"
            required
            placeholder="Your name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="res-phone">Phone</Label>
          <Input
            id="res-phone"
            type="tel"
            required
            placeholder="(725) 000-0000"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="res-email">Email</Label>
          <Input
            id="res-email"
            type="email"
            required
            placeholder="you@email.com"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="res-notes">Special notes (optional)</Label>
          <Textarea
            id="res-notes"
            placeholder="Birthday, anniversary, new job — anything we should know"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {nightlife && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">Deposit due today</span>
          <span className="font-heading text-3xl text-primary">${depositAmount}</span>
        </div>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting || !canSubmit} className="w-full shadow-glow-primary">
        {isSubmitting
          ? nightlife
            ? 'Redirecting…'
            : 'Reserving…'
          : nightlife
            ? `Pay $${depositAmount} Deposit`
            : 'Confirm Reservation'}
      </Button>
      {submitError && <p className="text-center text-sm text-destructive">{submitError}</p>}
      <p className="text-center text-xs text-muted-foreground">
        {nightlife
          ? `This $${depositAmount} deposit is non-refundable if you no-show, and is applied to your table's spend the night of your reservation.`
          : 'No deposit required for this reservation.'}
      </p>
    </form>
  )
}
