'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StaffNav } from '@/components/staff/staff-nav'
import type { CampaignChannel } from '@/lib/campaigns'
import type { ContentEvent } from '@/lib/content-data'

type ChannelForm = { enabled: boolean; subject: string; body: string; imageUrl: string }
const EMPTY_CHANNEL: ChannelForm = { enabled: false, subject: '', body: '', imageUrl: '' }

export function CampaignComposer() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [channels, setChannels] = useState<Record<CampaignChannel, ChannelForm>>({
    website: { ...EMPTY_CHANNEL, enabled: true },
    email: { ...EMPTY_CHANNEL, enabled: true },
    sms: { ...EMPTY_CHANNEL },
  })
  const [events, setEvents] = useState<ContentEvent[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/staff/content/events')
      .then((res) => res.json())
      .then((data) => setEvents(data.events ?? []))
  }, [])

  function updateChannel(channel: CampaignChannel, patch: Partial<ChannelForm>) {
    setChannels((c) => ({ ...c, [channel]: { ...c[channel], ...patch } }))
  }

  function prefillFromEvent(eventId: string) {
    const event = events.find((e) => e.id === eventId)
    if (!event) return
    const summary = `${event.title} — ${event.date} at ${event.time}. ${event.description}`.trim()
    setName((n) => n || event.title)
    updateChannel('website', { subject: event.title, body: summary, imageUrl: event.image_url })
    updateChannel('email', { subject: event.title, body: summary, imageUrl: event.image_url })
    updateChannel('sms', { body: `${event.title} — ${event.date} at ${event.time}. corkandthorn.com` })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const content = (Object.entries(channels) as [CampaignChannel, ChannelForm][])
      .filter(([, form]) => form.enabled)
      .map(([channel, form]) => ({
        channel,
        subject: form.subject || null,
        body: form.body,
        imageUrl: form.imageUrl || null,
      }))

    if (!name.trim()) {
      setError('Campaign name is required')
      return
    }
    if (content.length === 0) {
      setError('Enable at least one channel')
      return
    }
    if (content.some((c) => !c.body.trim())) {
      setError('Every enabled channel needs content')
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/staff/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, scheduledAt: scheduledAt || null, content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create campaign')
      router.push(`/staff/campaigns/${data.campaign.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B111B] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-heading text-3xl tracking-wide text-foreground">New campaign</h1>
            <StaffNav />
          </div>
          <Link href="/staff/campaigns" className="text-sm text-white/60 hover:text-white">
            ← Back to campaigns
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 rounded-2xl border border-white/10 bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Campaign name</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="bg-background" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="scheduledAt">Schedule for (optional)</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>

          {events.length > 0 && (
            <div className="grid gap-1.5">
              <Label htmlFor="prefill">Prefill from an event (optional)</Label>
              <select
                id="prefill"
                onChange={(e) => e.target.value && prefillFromEvent(e.target.value)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                defaultValue=""
              >
                <option value="">— none —</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.date})
                  </option>
                ))}
              </select>
            </div>
          )}

          <Tabs defaultValue="website">
            <TabsList>
              {(['website', 'email', 'sms'] as CampaignChannel[]).map((channel) => (
                <TabsTrigger key={channel} value={channel} className="capitalize">
                  {channel}
                </TabsTrigger>
              ))}
            </TabsList>

            {(['website', 'email', 'sms'] as CampaignChannel[]).map((channel) => (
              <TabsContent key={channel} value={channel} className="mt-4 grid gap-3">
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={channels[channel].enabled}
                    onChange={(e) => updateChannel(channel, { enabled: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-background"
                  />
                  Include this channel
                </label>

                {channel !== 'sms' && (
                  <div className="grid gap-1.5">
                    <Label>{channel === 'website' ? 'Post title' : 'Subject'}</Label>
                    <Input
                      value={channels[channel].subject}
                      onChange={(e) => updateChannel(channel, { subject: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                )}

                <div className="grid gap-1.5">
                  <Label>{channel === 'sms' ? 'Text (keep it short)' : 'Body'}</Label>
                  <Textarea
                    rows={channel === 'sms' ? 3 : 6}
                    value={channels[channel].body}
                    onChange={(e) => updateChannel(channel, { body: e.target.value })}
                    className="bg-background"
                  />
                  {channel === 'sms' && (
                    <p className="text-xs text-white/40">{channels.sms.body.length} characters</p>
                  )}
                </div>

                {channel !== 'sms' && (
                  <div className="grid gap-1.5">
                    <Label>Image URL</Label>
                    <Input
                      value={channels[channel].imageUrl}
                      onChange={(e) => updateChannel(channel, { imageUrl: e.target.value })}
                      className="bg-background"
                      placeholder="https://…"
                    />
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save draft'}
          </Button>
        </form>
      </div>
    </div>
  )
}
