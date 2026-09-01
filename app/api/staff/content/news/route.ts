import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { getStaffUserIdFromRequest } from '@/lib/staff-auth'

export async function GET(request: Request) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const sql = getSql()
  const news = await sql`SELECT * FROM news ORDER BY created_at DESC`
  return NextResponse.json({ news })
}

export async function POST(request: Request) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json().catch(() => null)
  const title = body?.title
  const bodyText = typeof body?.body === 'string' ? body.body : ''
  const imageUrl = typeof body?.imageUrl === 'string' ? body.imageUrl : ''
  const published = body?.published !== false

  if (typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }

  const sql = getSql()
  const rows = (await sql`
    INSERT INTO news (title, body, image_url, published)
    VALUES (${title}, ${bodyText}, ${imageUrl}, ${published})
    RETURNING *
  `) as Record<string, unknown>[]
  return NextResponse.json({ post: rows[0] }, { status: 201 })
}
