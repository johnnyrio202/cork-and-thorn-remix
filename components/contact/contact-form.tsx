'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export function ContactForm() {
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
          type: 'contact',
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone') || null,
          details: {
            subject: data.get('subject') || null,
            message: data.get('message'),
          },
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Unable to send message')
      }

      toast.success('Message sent!', { description: "We'll get back to you shortly." })
      form.reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-heading text-3xl tracking-wide">Get in Touch</h2>
      <p className="mt-1 text-sm text-muted-foreground">Questions, feedback, or anything else — we&apos;d love to hear from you.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="ct-name">Full name</Label>
          <Input id="ct-name" name="name" required placeholder="Your name" className="bg-background" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ct-email">Email</Label>
          <Input id="ct-email" name="email" type="email" required placeholder="you@email.com" className="bg-background" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ct-phone">Phone (optional)</Label>
          <Input id="ct-phone" name="phone" type="tel" placeholder="(725) 000-0000" className="bg-background" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ct-subject">Subject</Label>
          <Input id="ct-subject" name="subject" placeholder="What's this about?" className="bg-background" />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="ct-message">Message</Label>
          <Textarea id="ct-message" name="message" rows={5} required className="bg-background" />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-6 w-full shadow-glow-primary sm:w-auto">
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  )
}
