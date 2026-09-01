'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { NewsPost } from '@/lib/content-data'

const EMPTY_FORM = { title: '', body: '', imageUrl: '', published: true }

export function NewsAdmin() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/staff/content/news')
    const data = await res.json()
    setPosts(data.news ?? [])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function startEdit(post: NewsPost) {
    setEditingId(post.id)
    setForm({ title: post.title, body: post.body, imageUrl: post.image_url, published: post.published })
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
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch(editingId ? `/api/staff/content/news/${editingId}` : '/api/staff/content/news', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Save failed')
      resetForm()
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/staff/content/news/${id}`, { method: 'DELETE' })
    if (editingId === id) resetForm()
    load()
  }

  return (
    <div className="min-h-screen bg-[#0B111B] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl tracking-wide text-foreground">News</h1>
          <Link href="/staff/content" className="text-sm text-white/60 hover:text-white">
            ← Back to content
          </Link>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">
          <form onSubmit={handleSubmit} className="h-fit rounded-2xl border border-white/10 bg-card p-6">
            <h2 className="font-heading text-lg text-foreground">{editingId ? 'Edit post' : 'New post'}</h2>

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

              <div className="grid gap-1.5">
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  rows={6}
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  className="bg-background"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
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
                  <div className="relative mt-1 h-32 w-full overflow-hidden rounded-lg border border-white/10">
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

            <div className="mt-5 flex gap-2">
              <Button type="submit" disabled={isSaving} className="flex-1">
                {isSaving ? 'Saving…' : editingId ? 'Save changes' : 'Publish post'}
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
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Published</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.map((post) => (
                  <tr key={post.id} className="text-white/80">
                    <td className="px-4 py-3">{post.title}</td>
                    <td className="px-4 py-3">{post.published ? 'Yes' : 'Draft'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(post)} className="text-xs text-white/60 hover:text-white">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-xs text-destructive hover:text-destructive/80"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-white/40">
                      No posts yet.
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
