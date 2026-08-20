import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { BOOTHS, RESERVATION_DURATION_HOURS, normalizeNightHour } from '@/lib/data'

// A booth is taken for a (date, time) if an existing active booking on that
// booth/date — confirmed, or pending-deposit within Clover's session window
// — has an overlapping RESERVATION_DURATION_HOURS window. Bookings block a
// fixed window from arrival, not the whole night, so a table can turn over
// later the same night once that window passes.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const time = searchParams.get('time')

  if (!date) {
    return NextResponse.json({ error: 'date is required' }, { status: 400 })
  }

  const sql = getSql()

  let rows: { booth_id: string }[]

  if (!time) {
    // No time given (the staff dashboard's whole-night view) — a booth
    // counts as taken if it has ANY active booking that date, regardless
    // of which specific window. The guest wizard always passes a real
    // time once past its Time step, so it never hits this branch.
    rows = (await sql`
      SELECT booth_id FROM bookings
      WHERE reservation_date = ${date}
        AND (
          status = 'confirmed'
          OR (status = 'pending_deposit' AND created_at > now() - interval '20 minutes')
        )
    `) as { booth_id: string }[]
  } else {
    const requestedHour = normalizeNightHour(time)
    if (requestedHour === undefined) {
      return NextResponse.json({ error: `Invalid time: ${time}` }, { status: 400 })
    }

    rows = (await sql`
      SELECT booth_id FROM bookings
      WHERE reservation_date = ${date}
        AND (
          status = 'confirmed'
          OR (status = 'pending_deposit' AND created_at > now() - interval '20 minutes')
        )
        AND abs((CASE arrival_time
          WHEN '9:00 PM' THEN 21
          WHEN '10:00 PM' THEN 22
          WHEN '11:00 PM' THEN 23
          WHEN '12:00 AM' THEN 24
          WHEN '1:00 AM' THEN 25
          WHEN '2:00 AM' THEN 26
        END) - ${requestedHour}) < ${RESERVATION_DURATION_HOURS}
    `) as { booth_id: string }[]
  }

  const taken = new Set(rows.map((r) => r.booth_id))
  const availability: Record<string, 'available' | 'taken'> = {}
  for (const booth of BOOTHS) {
    availability[booth.id] = taken.has(booth.id) ? 'taken' : 'available'
  }

  return NextResponse.json(availability)
}
