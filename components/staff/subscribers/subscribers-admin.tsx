'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StaffNav } from '@/components/staff/staff-nav'
import type { Subscriber } from '@/lib/subscribers'

type Counts = { email: number; sms: number; total: number }

export function SubscribersAdmin() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [counts, setCounts] = useState<Counts>({ email: 0, sms: 0, total: 0 })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const emailFileRef = useRef<HTMLInputElement>(null)
  const smsFileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/staff/subscribers')
    const data = await res.json()
    setSubscribers(data.subscribers ?? [])
    setCounts(data.counts ?? { email: 0, sms: 0, total: 0 })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email.trim() && !phone.trim()) {
      setError('Enter an email or phone number')
      return
    }
    setIsSaving(true)
    try {
      const res = await fetch('/api/staff/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || null, email: email || null, phone: phone || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to add')
      setName('')
      setEmail('')
      setPhone('')
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleImport(channel: 'email' | 'sms', file: File | undefined) {
    if (!file) return
    setImportStatus(`Importing ${channel} list…`)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('channel', channel)
      const res = await fetch('/api/staff/subscribers/import', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Import failed')
      setImportStatus(`Imported ${data.imported} of ${data.total} rows (${data.skipped} skipped).`)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
      setImportStatus(null)
    }
  }

  async function toggleOptIn(subscriber: Subscriber, channel: 'email' | 'sms') {
    const current = channel === 'email' ? subscriber.email_opt_in : subscriber.sms_opt_in
    await fetch(`/api/staff/subscribers/${subscriber.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, optedIn: !current }),
    })
    load()
  }

  return (
    <div className="min-h-screen bg-[#0B111B] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-6">
          <h1 className="font-heading text-3xl tracking-wide text-foreground">Subscribers</h1>
          <StaffNav />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-card p-5">
            <p className="text-xs text-white/50">Email opted in</p>
            <p className="mt-1 font-heading text-2xl text-foreground">{counts.email.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-card p-5">
            <p className="text-xs text-white/50">SMS opted in</p>
            <p className="mt-1 font-heading text-2xl text-foreground">{counts.sms.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-card p-5">
            <p className="text-xs text-white/50">Total subscribers</p>
            <p className="mt-1 font-heading text-2xl text-foreground">{counts.total.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-card p-6">
            <h2 className="font-heading text-lg text-foreground">Bulk import</h2>
            <p className="mt-1 text-sm text-white/50">
              CSV with a header row (any column with "email" or "phone" in the name), or one value per line.
            </p>
            <div className="mt-4 grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="email-csv">Email list</Label>
                <Input
                  id="email-csv"
                  ref={emailFileRef}
                  type="file"
                  accept=".csv,text/csv,text/plain"
                  onChange={(e) => handleImport('email', e.target.files?.[0])}
                  className="bg-background"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sms-csv">SMS list</Label>
                <Input
                  id="sms-csv"
                  ref={smsFileRef}
                  type="file"
                  accept=".csv,text/csv,text/plain"
                  onChange={(e) => handleImport('sms', e.target.files?.[0])}
                  className="bg-background"
                />
              </div>
              {importStatus && <p className="text-sm text-white/60">{importStatus}</p>}
            </div>
          </div>

          <form onSubmit={handleAdd} className="rounded-2xl border border-white/10 bg-card p-6">
            <h2 className="font-heading text-lg text-foreground">Add manually</h2>
            <div className="mt-4 grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="sub-name">Name</Label>
                <Input id="sub-name" value={name} onChange={(e) => setName(e.target.value)} className="bg-background" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sub-email">Email</Label>
                <Input id="sub-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sub-phone">Phone</Label>
                <Input id="sub-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-background" />
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={isSaving} className="mt-4">
              {isSaving ? 'Adding…' : 'Add subscriber'}
            </Button>
          </form>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-white/50">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Email opt-in</th>
                <th className="px-4 py-3 font-medium">SMS opt-in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subscribers.map((s) => (
                <tr key={s.id} className="text-white/80">
                  <td className="px-4 py-3">{s.name ?? '—'}</td>
                  <td className="px-4 py-3">{s.email ?? '—'}</td>
                  <td className="px-4 py-3">{s.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-white/40">{s.source}</td>
                  <td className="px-4 py-3">
                    {s.email ? (
                      <button onClick={() => toggleOptIn(s, 'email')} className="text-xs hover:underline">
                        {s.email_opt_in ? 'Opted in' : 'Opted out'}
                      </button>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {s.phone ? (
                      <button onClick={() => toggleOptIn(s, 'sms')} className="text-xs hover:underline">
                        {s.sms_opt_in ? 'Opted in' : 'Opted out'}
                      </button>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-white/40">
                    No subscribers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {subscribers.length >= 200 && (
            <p className="px-4 py-3 text-xs text-white/40">Showing the first 200 — search/pagination isn’t built yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
