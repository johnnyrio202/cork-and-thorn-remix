'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StaffNav } from '@/components/staff/staff-nav'
import type { Campaign, CampaignChannel, CampaignContent } from '@/lib/campaigns'

type SmsStats = { queued: number; sent: number; failed: number }

const CHANNEL_LABEL: Record<CampaignChannel, string> = { website: 'Website', email: 'Email', sms: 'SMS' }

export function CampaignDetail({ campaignId }: { campaignId: string }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [content, setContent] = useState<CampaignContent[]>([])
  const [smsStats, setSmsStats] = useState<SmsStats>({ queued: 0, sent: 0, failed: 0 })
  const [smsConfigured, setSmsConfigured] = useState(true)
  const [busyChannel, setBusyChannel] = useState<CampaignChannel | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch(`/api/staff/campaigns/${campaignId}`)
    const data = await res.json()
    setCampaign(data.campaign ?? null)
    setContent(data.content ?? [])
    setSmsStats(data.smsStats ?? { queued: 0, sent: 0, failed: 0 })
    setSmsConfigured(data.smsConfigured ?? true)
  }, [campaignId])

  useEffect(() => {
    load()
  }, [load])

  async function handleApprove(channel: CampaignChannel) {
    setBusyChannel(channel)
    setError(null)
    setMessage(null)
    try {
      const res = await fetch(`/api/staff/campaigns/${campaignId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to send')

      if (channel === 'sms' && data.smsConfigured === false) {
        setMessage('SMS approved, but Twilio isn’t connected yet — nothing will send until it is.')
      } else if (channel === 'sms') {
        setMessage(`Queued ${data.queued} texts. They’ll go out gradually via the SMS cron job.`)
      } else if (channel === 'website') {
        setMessage('Published to the site.')
      } else if (channel === 'email') {
        setMessage('Email sent to the subscriber list.')
      }
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send')
    } finally {
      setBusyChannel(null)
    }
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#0B111B] px-4 py-10 text-white/60 sm:px-6 lg:px-10">Loading…</div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B111B] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-heading text-3xl tracking-wide text-foreground">{campaign.name}</h1>
            <StaffNav />
          </div>
          <Link href="/staff/campaigns" className="text-sm text-white/60 hover:text-white">
            ← Back to campaigns
          </Link>
        </div>

        {campaign.scheduled_at && (
          <p className="mt-2 text-sm text-white/50">Scheduled for {new Date(campaign.scheduled_at).toLocaleString()}</p>
        )}

        {message && <p className="mt-4 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">{message}</p>}
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <div className="mt-6 grid gap-4">
          {content.map((item) => (
            <div key={item.channel} className="rounded-2xl border border-white/10 bg-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg text-foreground">{CHANNEL_LABEL[item.channel]}</h2>
                <Badge variant={item.status === 'sent' || item.status === 'approved' ? 'default' : 'outline'}>
                  {item.status}
                </Badge>
              </div>

              {item.subject && <p className="mt-3 text-sm font-medium text-white/80">{item.subject}</p>}
              <p className="mt-1 whitespace-pre-wrap text-sm text-white/60">{item.body}</p>

              {item.channel === 'sms' && (
                <p className="mt-2 text-xs text-white/40">
                  {!smsConfigured
                    ? 'Twilio not connected yet.'
                    : `Queued ${smsStats.queued} · Sent ${smsStats.sent} · Failed ${smsStats.failed}`}
                </p>
              )}

              <div className="mt-4">
                <Button
                  onClick={() => handleApprove(item.channel)}
                  disabled={busyChannel !== null || item.status === 'sent'}
                >
                  {busyChannel === item.channel
                    ? 'Sending…'
                    : item.status === 'sent'
                      ? 'Sent'
                      : item.channel === 'website'
                        ? 'Approve & publish'
                        : 'Approve & send'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
