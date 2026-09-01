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
import { RESUME_UPLOADS_ENABLED } from '@/lib/feature-flags'

const positions = [
  'Bartender',
  'Server',
  'Host / Hostess',
  'Security',
  'Kitchen Staff',
  'Event Staff',
  'Other',
]

export function JobApplicationForm() {
  const [position, setPosition] = useState('')
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleResumeUpload(file: File) {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/inquiries/upload-resume', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      setResumeUrl(data.url)
      toast.success('Resume attached')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    if (!position) {
      toast.error('Please select a position')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'job',
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          details: {
            position,
            resumeUrl,
            coverNote: data.get('note') || null,
          },
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Unable to submit application')
      }

      toast.success('Application submitted!', {
        description: 'Thank you for applying — our hiring team will review and reach out.',
      })
      form.reset()
      setPosition('')
      setResumeUrl(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-heading text-3xl tracking-wide">Apply Now</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Join the Cork &amp; Thorn team — tell us a bit about yourself.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="j-name">Full name</Label>
          <Input id="j-name" name="name" required placeholder="Your name" className="bg-background" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="j-email">Email</Label>
          <Input id="j-email" name="email" type="email" required placeholder="you@email.com" className="bg-background" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="j-phone">Phone</Label>
          <Input id="j-phone" name="phone" type="tel" required placeholder="(725) 000-0000" className="bg-background" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="j-position">Position</Label>
          <Select value={position} onValueChange={(value) => setPosition(value ?? '')}>
            <SelectTrigger id="j-position" className="bg-background">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {RESUME_UPLOADS_ENABLED && (
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="j-resume">Resume (PDF or Word, under 5MB)</Label>
            <Input
              id="j-resume"
              type="file"
              accept=".pdf,.doc,.docx"
              className="bg-background"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleResumeUpload(file)
              }}
            />
            {isUploading && <p className="text-xs text-muted-foreground">Uploading…</p>}
            {resumeUrl && !isUploading && <p className="text-xs text-muted-foreground">Resume attached ✓</p>}
          </div>
        )}
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="j-note">Anything else you&apos;d like us to know?</Label>
          <Textarea id="j-note" name="note" rows={4} className="bg-background" />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting || isUploading} className="mt-6 w-full shadow-glow-primary sm:w-auto">
        {isSubmitting ? 'Submitting…' : 'Submit Application'}
      </Button>
    </form>
  )
}
