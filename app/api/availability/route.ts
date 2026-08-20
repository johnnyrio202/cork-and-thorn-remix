import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { BOOTHS } from '@/lib/data'

// A booth is taken for a date if it has a confirmed booking, or a
// pending-deposit booking whose Clover checkout session hasn't yet
// expired (Clover sessions expire 15 minutes after creation — 20 minutes
// gives a small buffer without needing a cleanup job for abandoned checkouts).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  if (!date) {
    return NextResponse.json({ error: 'date is required' }, { status: 400 })
  }

  const sql = getSql()
  const rows = (await sql`
    SELECT booth_id
    FROM bookings
    WHERE reservation_date = ${date}
      AND (
        status = 'confirmed'
        OR (status = 'pending_deposit' AND created_at > now() - interval '20 minutes')
      )
  `) as { booth_id: string }[]

  const taken = new Set(rows.map((r) => r.booth_id))
  const availability: Record<string, 'available' | 'taken'> = {}
  for (const booth of BOOTHS) {
    availability[booth.id] = taken.has(booth.id) ? 'taken' : 'available'
  }

  return NextResponse.json(availability)
}
