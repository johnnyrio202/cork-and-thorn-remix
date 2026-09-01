'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

const eventTypes = [
  'Birthday Celebration',
  'Corporate Event',
  'Bachelor / Bachelorette',
  'Album / Single Release',
  'Private Dinner',
  'Full Venue Buyout',
  'Other',
]

export function PartyInquiryForm() {
  const [eventType, setEventType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    if (!eventType) {
      toast.error('Please select an event type')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'party',
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          details: {
            eventType,
            preferredDate: data.get('date') || null,
            guestCount: data.get('guests'),
            message: data.get('details') || null,
          },
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Unable to send inquiry')
      }

      toast.success('Inquiry sent!', {
        description: 'Thank you — our events team will reach out within 24 hours to craft your night.',
      })
      form.reset()
      setEventType('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to send inquiry')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <h2 className="font-heading text-3xl tracking-wide">Tell Us About Your Event</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Share the details and our events team will build a bespoke proposal.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="p-name">Full name</Label>
          <Input id="p-name" name="name" required placeholder="Your name" className="bg-background" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="p-email">Email</Label>
          <Input
            id="p-email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
            className="bg-background"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="p-phone">Phone</Label>
          <Input
            id="p-phone"
            name="phone"
            type="tel"
            required
            placeholder="(725) 000-0000"
            className="bg-background"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="p-type">Event type</Label>
          <Select value={eventType} onValueChange={(value) => setEventType(value ?? '')}>
            <SelectTrigger id="p-type" className="bg-background">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="p-date">Preferred date</Label>
          <Input id="p-date" name="date" type="date" className="bg-background" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="p-guests">Estimated guests</Label>
          <Input
            id="p-guests"
            name="guests"
            type="number"
            min={1}
            required
            placeholder="e.g. 25"
            className="bg-background"
          />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="p-details">Vision &amp; details</Label>
          <Textarea
            id="p-details"
            name="details"
            rows={5}
            placeholder="Tell us about the occasion, any entertainment requests, bottle service, catering, or special touches you have in mind."
            className="bg-background"
          />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-6 w-full shadow-glow-primary sm:w-auto">
        {isSubmitting ? 'Sending…' : 'Submit Inquiry'}
      </Button>
    </form>
  )
}
