'use client'

import { useCallback, useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StaffNav } from '@/components/staff/staff-nav'
import type { Inquiry, InquiryStatus, InquiryType } from '@/lib/inquiries'

const TYPE_TABS: { value: InquiryType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'party', label: 'Parties' },
  { value: 'catering', label: 'Catering' },
  { value: 'job', label: 'Jobs' },
  { value: 'contact', label: 'Contact' },
]

const STATUS_VARIANT: Record<InquiryStatus, 'default' | 'secondary' | 'outline'> = {
  new: 'default',
  in_progress: 'secondary',
  closed: 'outline',
}

const NEXT_STATUS: Record<InquiryStatus, InquiryStatus | null> = {
  new: 'in_progress',
  in_progress: 'closed',
  closed: null,
}

const NEXT_STATUS_LABEL: Record<InquiryStatus, string> = {
  new: 'Mark In Progress',
  in_progress: 'Mark Closed',
  closed: 'Closed',
}

function formatDetails(details: Record<string, unknown>): string {
  return Object.entries(details)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => `${k}: ${v}`)
    .join('  ·  ')
}

export function InquiriesAdmin() {
  const [typeFilter, setTypeFilter] = useState<InquiryType | 'all'>('all')
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    setIsLoading(true)
    const params = typeFilter !== 'all' ? `?type=${typeFilter}` : ''
    const res = await fetch(`/api/staff/inquiries${params}`)
    const data = await res.json()
    setInquiries(data.inquiries ?? [])
    setIsLoading(false)
  }, [typeFilter])

  useEffect(() => {
    load()
  }, [load])

  async function handleAdvanceStatus(inquiry: Inquiry) {
    const next = NEXT_STATUS[inquiry.status]
    if (!next) return
    await fetch(`/api/staff/inquiries/${inquiry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    load()
  }

  const selected = inquiries.find((i) => i.id === selectedId) ?? null

  return (
    <div className="min-h-screen bg-[#0B111B] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-6">
          <h1 className="font-heading text-3xl tracking-wide text-foreground">Inquiries</h1>
          <StaffNav />
        </div>

        <Tabs value={typeFilter} onValueChange={(v) => v && setTypeFilter(v as InquiryType | 'all')} className="mt-6">
          <TabsList>
            {TYPE_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-white/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {inquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    onClick={() => setSelectedId(inquiry.id)}
                    className={`cursor-pointer text-white/80 hover:bg-white/[0.03] ${selectedId === inquiry.id ? 'bg-white/[0.05]' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div>{inquiry.name}</div>
                      <div className="text-xs text-white/40">{inquiry.email}</div>
                    </td>
                    <td className="px-4 py-3 capitalize">{inquiry.type}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[inquiry.status]}>{inquiry.status.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-4 py-3 text-white/50">{new Date(inquiry.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!isLoading && inquiries.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-white/40">
                      No inquiries yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="h-fit rounded-2xl border border-white/10 bg-card p-5">
            {!selected ? (
              <p className="text-sm text-white/40">Select an inquiry to view details.</p>
            ) : (
              <>
                <h2 className="font-heading text-lg text-foreground">{selected.name}</h2>
                <p className="mt-1 text-sm text-white/60">{selected.email}</p>
                {selected.phone && <p className="text-sm text-white/60">{selected.phone}</p>}
                <p className="mt-3 text-xs text-white/40 capitalize">{selected.type} · {new Date(selected.created_at).toLocaleString()}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{formatDetails(selected.details)}</p>

                <div className="mt-5">
                  <Button
                    onClick={() => handleAdvanceStatus(selected)}
                    disabled={!NEXT_STATUS[selected.status]}
                    className="w-full"
                  >
                    {NEXT_STATUS_LABEL[selected.status]}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
