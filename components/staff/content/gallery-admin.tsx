'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { GalleryImage } from '@/lib/content-data'

export function GalleryAdmin() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/staff/content/gallery')
    const data = await res.json()
    setImages(data.images ?? [])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleUpload(file: File) {
    setIsUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/staff/content/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error ?? 'Upload failed')

      const res = await fetch('/api/staff/content/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: uploadData.url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Save failed')
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/staff/content/gallery/${id}`, { method: 'DELETE' })
    load()
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= images.length) return
    const a = images[index]
    const b = images[targetIndex]

    await Promise.all([
      fetch(`/api/staff/content/gallery/${a.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: b.sort_order }),
      }),
      fetch(`/api/staff/content/gallery/${b.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: a.sort_order }),
      }),
    ])
    load()
  }

  return (
    <div className="min-h-screen bg-[#0B111B] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl tracking-wide text-foreground">Gallery</h1>
          <Link href="/staff/content" className="text-sm text-white/60 hover:text-white">
            ← Back to content
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-card p-6">
          <label className="text-sm text-white/70">
            Upload photo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUpload(file)
              }}
              className="mt-2 block w-full text-sm text-white/70 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
            />
          </label>
          {isUploading && <p className="mt-2 text-xs text-white/50">Uploading…</p>}
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <div key={image.id} className="overflow-hidden rounded-xl border border-white/10 bg-card">
              <div className="relative aspect-square">
                <Image src={image.image_url} alt={image.caption} fill className="object-cover" unoptimized />
              </div>
              <div className="flex items-center justify-between px-2 py-2 text-xs text-white/60">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleMove(index, -1)}
                    disabled={index === 0}
                    className="disabled:opacity-30 hover:text-white"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMove(index, 1)}
                    disabled={index === images.length - 1}
                    className="disabled:opacity-30 hover:text-white"
                  >
                    ↓
                  </button>
                </div>
                <button onClick={() => handleDelete(image.id)} className="text-destructive hover:text-destructive/80">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <p className="col-span-full py-6 text-center text-white/40">No photos yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
