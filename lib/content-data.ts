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
// Neon returns Postgres `date` columns as JS Date objects at runtime even
// though the driver's types claim string — normalize to YYYY-MM-DD here so
// downstream code (localeCompare-based sorting, etc.) always gets a string.
function toDateString(date: string | Date): string {
  if (date instanceof Date) return date.toISOString().slice(0, 10)
  return date
}

// Applied to every row read from the `events` table so every consumer
// (toEventItem, the staff admin panel, the events explorer) gets a real
// date string regardless of what the driver handed back.
function normalizeEventRow(row: ContentEvent): ContentEvent {
  return { ...row, date: toDateString(row.date) }
}

export function toEventItem(event: ContentEvent): EventItem {
  return {
    id: event.id,
    title: event.title,
    date: toDateString(event.date),
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
  const rows = (await sql`
    SELECT * FROM events WHERE published = true ORDER BY date ASC
  `) as ContentEvent[]
  return rows.map(normalizeEventRow)
}

export async function getUpcomingEvents(limit = 8): Promise<ContentEvent[]> {
  const sql = getSql()
  const rows = (await sql`
    SELECT * FROM events
    WHERE published = true AND date >= CURRENT_DATE
    ORDER BY date ASC
    LIMIT ${limit}
  `) as ContentEvent[]
  return rows.map(normalizeEventRow)
}

export async function getEventBySlug(slug: string): Promise<ContentEvent | null> {
  const sql = getSql()
  const rows = (await sql`
    SELECT * FROM events WHERE slug = ${slug} AND published = true LIMIT 1
  `) as ContentEvent[]
  return rows[0] ? normalizeEventRow(rows[0]) : null
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
  const rows = (await sql`SELECT * FROM events ORDER BY date DESC`) as ContentEvent[]
  return rows.map(normalizeEventRow)
}

export async function getAllNews(): Promise<NewsPost[]> {
  const sql = getSql()
  return (await sql`SELECT * FROM news ORDER BY created_at DESC`) as NewsPost[]
}
