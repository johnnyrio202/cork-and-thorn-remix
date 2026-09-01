import { NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import { getSql } from '@/lib/db'
import { getStaffUserIdFromRequest } from '@/lib/staff-auth'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body || typeof body.sortOrder !== 'number') {
    return NextResponse.json({ error: 'sortOrder (number) is required' }, { status: 400 })
  }

  const sql = getSql()
  const rows = (await sql`
    UPDATE gallery_images SET sort_order = ${body.sortOrder} WHERE id = ${id} RETURNING *
  `) as Record<string, unknown>[]
  if (!rows[0]) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ image: rows[0] })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const sql = getSql()
  const rows = (await sql`
    DELETE FROM gallery_images WHERE id = ${id} RETURNING image_url
  `) as { image_url: string }[]

  const imageUrl = rows[0]?.image_url
  if (imageUrl) {
    await del(imageUrl).catch(() => {
      // Blob may already be gone or URL may predate Blob storage — deleting
      // the DB row is what matters; a stray blob costs nothing to leave.
    })
  }
  return NextResponse.json({ ok: true })
}
