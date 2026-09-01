import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { getStaffUserIdFromRequest } from '@/lib/staff-auth'
import { slugify } from '@/lib/content-data'

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const REPEAT_KINDS = ['none', 'weekly', 'biweekly', 'monthly'] as const
const MAX_OCCURRENCES = 104 // safety cap — two years of weekly repeats

function weekdayName(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
}

function addDaysStr(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + days)
  return dt.toISOString().slice(0, 10)
}

function addMonthsStr(iso: string, months: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1 + months, 1))
  const daysInMonth = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth() + 1, 0)).getUTCDate()
  dt.setUTCDate(Math.min(d, daysInMonth))
  return dt.toISOString().slice(0, 10)
}

// First date is the form's own date; each following one steps forward by
// the chosen cadence until (and including) `until`, capped at MAX_OCCURRENCES.
function occurrenceDates(startDate: string, repeat: (typeof REPEAT_KINDS)[number], until: string): string[] {
  const dates = [startDate]
  const step = repeat === 'weekly' ? (d: string) => addDaysStr(d, 7)
    : repeat === 'biweekly' ? (d: string) => addDaysStr(d, 14)
    : (d: string) => addMonthsStr(d, 1)
  let cursor = startDate
  while (dates.length < MAX_OCCURRENCES) {
    cursor = step(cursor)
    if (cursor > until) break
    dates.push(cursor)
  }
  return dates
}

export async function GET(request: Request) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sql = getSql()
  const events = await sql`SELECT * FROM events ORDER BY date DESC`
  return NextResponse.json({ events })
}

export async function POST(request: Request) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const title = body?.title
  const date = body?.date
  const day = body?.day
  const time = body?.time
  const category = body?.category
  const description = typeof body?.description === 'string' ? body.description : ''
  const price = Number(body?.price ?? 0)
  const imageUrl = typeof body?.imageUrl === 'string' ? body.imageUrl : ''
  const artist = typeof body?.artist === 'string' ? body.artist : ''
  const capacity = body?.capacity !== undefined && body.capacity !== null && body.capacity !== '' ? Number(body.capacity) : null
  const published = body?.published !== false
  const repeat = REPEAT_KINDS.includes(body?.repeat) ? body.repeat : 'none'
  const repeatUntil = typeof body?.repeatUntil === 'string' ? body.repeatUntil : ''

  if (
    typeof title !== 'string' || !title.trim() ||
    typeof date !== 'string' || !date.trim() ||
    typeof day !== 'string' || !day.trim() ||
    typeof time !== 'string' || !time.trim() ||
    typeof category !== 'string' || !category.trim()
  ) {
    return NextResponse.json(
      { error: 'title, date, day, time, and category are required' },
      { status: 400 },
    )
  }

  if (repeat !== 'none' && (!repeatUntil.trim() || repeatUntil <= date)) {
    return NextResponse.json(
      { error: 'repeatUntil must be a date after the event date' },
      { status: 400 },
    )
  }

  const dates = repeat === 'none' ? [date] : occurrenceDates(date, repeat, repeatUntil)
  const sql = getSql()
  const rows: Record<string, unknown>[] = []
  for (const [i, occurrenceDate] of dates.entries()) {
    const occurrenceDay = i === 0 ? day : weekdayName(occurrenceDate)
    const slug = slugify(title, occurrenceDate)
    const inserted = (await sql`
      INSERT INTO events (title, slug, date, day, time, category, description, price, image_url, artist, capacity, published)
      VALUES (${title}, ${slug}, ${occurrenceDate}, ${occurrenceDay}, ${time}, ${category}, ${description}, ${price}, ${imageUrl}, ${artist}, ${capacity}, ${published})
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title, day = EXCLUDED.day, time = EXCLUDED.time, category = EXCLUDED.category,
        description = EXCLUDED.description, price = EXCLUDED.price, image_url = EXCLUDED.image_url,
        artist = EXCLUDED.artist, capacity = EXCLUDED.capacity, published = EXCLUDED.published, updated_at = now()
      RETURNING *
    `) as Record<string, unknown>[]
    rows.push(inserted[0])
  }
  return NextResponse.json({ event: rows[0], events: rows }, { status: 201 })
}
