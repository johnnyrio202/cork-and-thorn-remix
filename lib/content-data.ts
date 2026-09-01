import { getSql } from '@/lib/db'
import type { EventItem } from '@/lib/data'

export type ContentEvent = {
  id: string
  title: string
  slug: string
  date: string
  day: string
  time: string
  category: string
  description: string
  price: number
  image_url: string
  artist: string
  capacity: number | null
  published: boolean
  created_at: string
  updated_at: string
}

export type NewsPost = {
  id: string
  title: string
  body: string
  image_url: string
  published: boolean
  created_at: string
}

export type GalleryImage = {
  id: string
  image_url: string
  caption: string
  sort_order: number
  created_at: string
}

// The reservation-flow calendar components (weekly-calendar-carousel.tsx,
// experiences-lineup.tsx) were built against lib/data.ts's static
// EventItem shape. This adapts a real CMS row to that shape so those
// components' date-grouping/animation/interaction logic didn't need to
// change — only their data source did.
export function toEventItem(event: ContentEvent): EventItem {
  return {
    id: event.id,
    title: event.title,
    date: event.date,
    day: event.day,
    time: event.time,
    category: event.category,
    description: event.description,
    price: event.price,
    image: event.image_url,
    artist: event.artist,
  }
}

export function slugify(title: string, date: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${base}-${date}`
}

// ---- Public reads (published only) ----

export async function getPublishedEvents(): Promise<ContentEvent[]> {
  const sql = getSql()
  return (await sql`
    SELECT * FROM events WHERE published = true ORDER BY date ASC
  `) as ContentEvent[]
}

export async function getUpcomingEvents(limit = 8): Promise<ContentEvent[]> {
  const sql = getSql()
  return (await sql`
    SELECT * FROM events
    WHERE published = true AND date >= CURRENT_DATE
    ORDER BY date ASC
    LIMIT ${limit}
  `) as ContentEvent[]
}

export async function getEventBySlug(slug: string): Promise<ContentEvent | null> {
  const sql = getSql()
  const rows = (await sql`
    SELECT * FROM events WHERE slug = ${slug} AND published = true LIMIT 1
  `) as ContentEvent[]
  return rows[0] ?? null
}

export async function getPublishedNews(): Promise<NewsPost[]> {
  const sql = getSql()
  return (await sql`
    SELECT * FROM news WHERE published = true ORDER BY created_at DESC
  `) as NewsPost[]
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const sql = getSql()
  return (await sql`
    SELECT * FROM gallery_images ORDER BY sort_order ASC, created_at ASC
  `) as GalleryImage[]
}

// ---- Admin reads (all rows, published or not) ----

export async function getAllEvents(): Promise<ContentEvent[]> {
  const sql = getSql()
  return (await sql`SELECT * FROM events ORDER BY date DESC`) as ContentEvent[]
}

export async function getAllNews(): Promise<NewsPost[]> {
  const sql = getSql()
  return (await sql`SELECT * FROM news ORDER BY created_at DESC`) as NewsPost[]
}
