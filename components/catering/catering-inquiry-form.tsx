'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export function CateringInquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'catering',
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          details: {
            eventDate: data.get('date'),
            guestCount: data.get('guests'),
            cuisineNotes: data.get('cuisine') || null,
            message: data.get('message') || null,
          },
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Unable to send inquiry')
      }

      toast.success('Inquiry sent!', {
        description: 'Thank you — our catering team will follow up with availability and a quote.',
      })
      form.reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to send inquiry')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-heading text-3xl tracking-wide">Request a Catering Quote</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Tell us about your event and we&apos;ll put together a custom catering proposal.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="c-name">Full name</Label>
          <Input id="c-name" name="name" required placeholder="Your name" className="bg-background" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" name="email" type="email" required placeholder="you@email.com" className="bg-background" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="c-phone">Phone</Label>
          <Input id="c-phone" name="phone" type="tel" required placeholder="(725) 000-0000" className="bg-background" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="c-date">Event date</Label>
          <Input id="c-date" name="date" type="date" required className="bg-background" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="c-guests">Estimated guests</Label>
          <Input id="c-guests" name="guests" type="number" min={1} required placeholder="e.g. 50" className="bg-background" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="c-cuisine">Cuisine preferences</Label>
          <Input id="c-cuisine" name="cuisine" placeholder="e.g. small bites, dietary restrictions" className="bg-background" />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="c-message">Additional details</Label>
          <Textarea id="c-message" name="message" rows={5} placeholder="Anything else we should know?" className="bg-background" />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-6 w-full shadow-glow-primary sm:w-auto">
        {isSubmitting ? 'Sending…' : 'Request Quote'}
      </Button>
    </form>
  )
}
