import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { getStaffUserIdFromRequest } from '@/lib/staff-auth'

export async function GET(request: Request) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const sql = getSql()
  const images = await sql`SELECT * FROM gallery_images ORDER BY sort_order ASC, created_at ASC`
  return NextResponse.json({ images })
}

export async function POST(request: Request) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json().catch(() => null)
  const imageUrl = body?.imageUrl
  const caption = typeof body?.caption === 'string' ? body.caption : ''

  if (typeof imageUrl !== 'string' || !imageUrl.trim()) {
    return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 })
  }

  const sql = getSql()
  const [{ max_order }] = (await sql`
    SELECT COALESCE(MAX(sort_order), -1) AS max_order FROM gallery_images
  `) as { max_order: number }[]

  const rows = (await sql`
    INSERT INTO gallery_images (image_url, caption, sort_order)
    VALUES (${imageUrl}, ${caption}, ${max_order + 1})
    RETURNING *
  `) as Record<string, unknown>[]
  return NextResponse.json({ image: rows[0] }, { status: 201 })
}
