import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { getStaffUserIdFromRequest } from '@/lib/staff-auth'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const sql = getSql()
  const rows = (await sql`
    UPDATE bookings SET status = 'no_show'
    WHERE id = ${id} AND status IN ('confirmed', 'pending_deposit')
    RETURNING id
  `) as { id: string }[]

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Booking not found or already resolved' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
