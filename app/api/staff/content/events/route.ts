import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { getStaffUserIdFromRequest } from '@/lib/staff-auth'
import { slugify } from '@/lib/content-data'

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

  const slug = slugify(title, date)
  const sql = getSql()
  const rows = (await sql`
    INSERT INTO events (title, slug, date, day, time, category, description, price, image_url, artist, capacity, published)
    VALUES (${title}, ${slug}, ${date}, ${day}, ${time}, ${category}, ${description}, ${price}, ${imageUrl}, ${artist}, ${capacity}, ${published})
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title, day = EXCLUDED.day, time = EXCLUDED.time, category = EXCLUDED.category,
      description = EXCLUDED.description, price = EXCLUDED.price, image_url = EXCLUDED.image_url,
      artist = EXCLUDED.artist, capacity = EXCLUDED.capacity, published = EXCLUDED.published, updated_at = now()
    RETURNING *
  `) as Record<string, unknown>[]
  return NextResponse.json({ event: rows[0] }, { status: 201 })
}
