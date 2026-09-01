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
    UPDATE news SET
      title = COALESCE(${body.title ?? null}, title),
      body = COALESCE(${body.body ?? null}, body),
      image_url = COALESCE(${body.imageUrl ?? null}, image_url),
      published = COALESCE(${body.published ?? null}, published)
    WHERE id = ${id}
    RETURNING *
  `) as Record<string, unknown>[]
  if (!rows[0]) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ post: rows[0] })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const sql = getSql()
  await sql`DELETE FROM news WHERE id = ${id}`
  return NextResponse.json({ ok: true })
}
