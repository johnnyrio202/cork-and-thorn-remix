'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ContentEvent } from '@/lib/content-data'

const CATEGORIES = ['R&B', 'Hip-Hop', 'Live Band', 'Live Music', 'DJ Set', 'Open Mic', 'Game Night', 'Comedy']

const REPEAT_OPTIONS = [
  { value: 'none', label: "Doesn't repeat" },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
]

const EMPTY_FORM = {
  title: '',
  date: '',
  day: '',
  time: '',
  category: CATEGORIES[0],
  description: '',
  price: '0',
  artist: '',
  imageUrl: '',
  capacity: '',
  published: true,
  repeat: 'none',
  repeatUntil: '',
}

export function EventsAdmin() {
  const [events, setEvents] = useState<ContentEvent[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/staff/content/events')
    const data = await res.json()
    setEvents(data.events ?? [])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function startEdit(event: ContentEvent) {
    setEditingId(event.id)
    setForm({
      title: event.title,
      date: event.date.slice(0, 10),
      day: event.day,
      time: event.time,
      category: event.category,
      description: event.description,
      price: String(event.price),
      artist: event.artist,
      imageUrl: event.image_url,
      capacity: event.capacity === null ? '' : String(event.capacity),
      published: event.published,
      repeat: 'none',
      repeatUntil: '',
    })
  }

  function resetForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  async function handleUpload(file: File) {
    setIsUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/staff/content/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      setForm((f) => ({ ...f, imageUrl: data.url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingId && form.repeat !== 'none' && !form.repeatUntil) {
      setError('Pick a "Repeat until" date')
      return
    }
    setIsSaving(true)
    setError(null)
    setStatus(null)
    try {
      const payload = {
        title: form.title,
        date: form.date,
        day: form.day,
        time: form.time,
        category: form.category,
        description: form.description,
        price: Number(form.price) || 0,
        artist: form.artist,
        imageUrl: form.imageUrl,
        capacity: form.capacity.trim() === '' ? null : Number(form.capacity),
        published: form.published,
        ...(!editingId && form.repeat !== 'none'
          ? { repeat: form.repeat, repeatUntil: form.repeatUntil }
          : {}),
      }
      const res = await fetch(
        editingId ? `/api/staff/content/events/${editingId}` : '/api/staff/content/events',
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Save failed')
      if (!editingId && Array.isArray(data.events) && data.events.length > 1) {
        setStatus(`Created ${data.events.length} events (${form.repeat}, through ${form.repeatUntil}).`)
      }
      resetForm()
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/staff/content/events/${id}`, { method: 'DELETE' })
    if (editingId === id) resetForm()
    load()
  }

  return (
    <div className="min-h-screen bg-[#0B111B] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl tracking-wide text-foreground">Events</h1>
          <Link href="/staff/content" className="text-sm text-white/60 hover:text-white">
            ← Back to content
          </Link>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-2xl border border-white/10 bg-card p-6"
          >
            <h2 className="font-heading text-lg text-foreground">
              {editingId ? 'Edit event' : 'New event'}
            </h2>

            <div className="mt-4 grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="bg-background"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="day">Day</Label>
                  <Input
                    id="day"
                    required
                    placeholder="Friday"
                    value={form.day}
                    onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
                    className="bg-background"
                  />
                </div>
              </div>

              {!editingId && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="repeat">Repeats</Label>
                    <select
                      id="repeat"
                      value={form.repeat}
                      onChange={(e) => setForm((f) => ({ ...f, repeat: e.target.value }))}
                      className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {REPEAT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  {form.repeat !== 'none' && (
                    <div className="grid gap-1.5">
                      <Label htmlFor="repeatUntil">Repeat until</Label>
                      <Input
                        id="repeatUntil"
                        type="date"
                        required
                        min={form.date || undefined}
                        value={form.repeatUntil}
                        onChange={(e) => setForm((f) => ({ ...f, repeatUntil: e.target.value }))}
                        className="bg-background"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    required
                    placeholder="11:00 PM"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    className="bg-background"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="bg-background"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="artist">Artist / Host</Label>
                  <Input
                    id="artist"
                    value={form.artist}
                    onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))}
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="capacity">Ticket capacity (blank = unlimited)</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="0"
                  placeholder="Unlimited"
                  value={form.capacity}
                  onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                  className="bg-background"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="bg-background"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="flyer">Flyer image</Label>
                <Input
                  id="flyer"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleUpload(file)
                  }}
                  className="bg-background"
                />
                {isUploading && <p className="text-xs text-white/50">Uploading…</p>}
                {form.imageUrl && (
                  <div className="relative mt-1 h-32 w-24 overflow-hidden rounded-lg border border-white/10">
                    <Image src={form.imageUrl} alt="" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>

              <label className="mt-1 flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                  className="h-4 w-4 rounded border-white/20 bg-background"
                />
                Published
              </label>
            </div>

            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            {status && <p className="mt-3 text-sm text-emerald-400">{status}</p>}

            <div className="mt-5 flex gap-2">
              <Button type="submit" disabled={isSaving} className="flex-1">
                {isSaving ? 'Saving…' : editingId ? 'Save changes' : 'Create event'}
              </Button>
              {editingId && (
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-white/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Published</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {events.map((event) => (
                  <tr key={event.id} className="text-white/80">
                    <td className="px-4 py-3 whitespace-nowrap">{event.date.slice(0, 10)}</td>
                    <td className="px-4 py-3">{event.title}</td>
                    <td className="px-4 py-3">{event.category}</td>
                    <td className="px-4 py-3">{event.published ? 'Yes' : 'Draft'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(event)} className="text-xs text-white/60 hover:text-white">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-xs text-destructive hover:text-destructive/80"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-white/40">
                      No events yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
