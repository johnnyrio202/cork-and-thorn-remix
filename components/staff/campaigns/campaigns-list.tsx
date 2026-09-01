'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StaffNav } from '@/components/staff/staff-nav'
import type { Campaign } from '@/lib/campaigns'

const STATUS_VARIANT: Record<Campaign['status'], 'default' | 'secondary' | 'outline'> = {
  draft: 'outline',
  scheduled: 'secondary',
  sending: 'secondary',
  sent: 'default',
  archived: 'outline',
}

export function CampaignsList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/staff/campaigns')
      .then((res) => res.json())
      .then((data) => setCampaigns(data.campaigns ?? []))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#0B111B] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-heading text-3xl tracking-wide text-foreground">Campaigns</h1>
            <StaffNav />
          </div>
          <Button render={<Link href="/staff/campaigns/new" />}>New campaign</Button>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-white/50">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Scheduled</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {campaigns.map((c) => (
                <tr key={c.id} className="text-white/80">
                  <td className="px-4 py-3">
                    <Link href={`/staff/campaigns/${c.id}`} className="hover:text-white hover:underline">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[c.status]}>{c.status}</Badge>
                  </td>
                  <td className="px-4 py-3">{c.scheduled_at ? new Date(c.scheduled_at).toLocaleString() : '—'}</td>
                  <td className="px-4 py-3">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!isLoading && campaigns.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-white/40">
                    No campaigns yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
