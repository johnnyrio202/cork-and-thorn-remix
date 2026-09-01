'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { ContentEvent } from '@/lib/content-data'

export function TicketPurchaseForm({ event }: { event: ContentEvent }) {
  const [quantity, setQuantity] = useState(1)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handlePurchase(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Enter your email to continue')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/checkout/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id, quantity, email }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? 'Unable to start checkout')
      }
      if (data.free) {
        toast.success('You’re in!', { description: `Check ${email} for your confirmation.` })
        setIsSubmitting(false)
        return
      }
      if (!data.href) {
        throw new Error('Unable to start checkout')
      }
      window.location.href = data.href
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to start checkout')
      setIsSubmitting(false)
    }
  }

  const total = (event.price * quantity).toFixed(2)

  return (
    <form onSubmit={handlePurchase} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-heading text-2xl tracking-wide">Get Tickets</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {event.price === 0 ? 'Free entry' : `$${event.price} per ticket`}
      </p>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="t-email">Email</Label>
          <Input
            id="t-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="bg-background"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="t-qty">Quantity</Label>
          <Input
            id="t-qty"
            type="number"
            min={1}
            max={10}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            className="bg-background"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="font-heading text-xl">${total}</span>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-6 w-full shadow-glow-primary">
        {isSubmitting ? 'Redirecting…' : event.price === 0 ? 'Reserve Free Tickets' : 'Buy Tickets'}
      </Button>
    </form>
  )
}
