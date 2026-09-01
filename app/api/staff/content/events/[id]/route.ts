import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { getStaffUserIdFromRequest } from '@/lib/staff-auth'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const sql = getSql()
  const rows = (await sql`
    UPDATE events SET
      title = COALESCE(${body.title ?? null}, title),
      date = COALESCE(${body.date ?? null}, date),
      day = COALESCE(${body.day ?? null}, day),
      time = COALESCE(${body.time ?? null}, time),
      category = COALESCE(${body.category ?? null}, category),
      description = COALESCE(${body.description ?? null}, description),
      price = COALESCE(${body.price ?? null}, price),
      image_url = COALESCE(${body.imageUrl ?? null}, image_url),
      artist = COALESCE(${body.artist ?? null}, artist),
      capacity = COALESCE(${body.capacity ?? null}, capacity),
      published = COALESCE(${body.published ?? null}, published),
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `) as Record<string, unknown>[]
  if (!rows[0]) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ event: rows[0] })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const sql = getSql()
  await sql`DELETE FROM events WHERE id = ${id}`
  return NextResponse.json({ ok: true })
}
