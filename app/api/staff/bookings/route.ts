import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { getStaffUserIdFromRequest } from '@/lib/staff-auth'

export async function GET(request: Request) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  if (!date) {
    return NextResponse.json({ error: 'date is required' }, { status: 400 })
  }

  const sql = getSql()
  // arrival_time is a text label ("9:00 PM", "1:00 AM", ...) — order it by
  // the night's real chronological sequence, not alphabetically.
  const bookings = await sql`
    SELECT id, booth_id, tier_id, reservation_date, arrival_time, party_size,
           guest_name, guest_phone, guest_email, promoter_code,
           deposit_amount_cents, notes, status, created_at
    FROM bookings
    WHERE reservation_date = ${date}
    ORDER BY CASE arrival_time
      WHEN '9:00 PM' THEN 0
      WHEN '10:00 PM' THEN 1
      WHEN '11:00 PM' THEN 2
      WHEN '12:00 AM' THEN 3
      WHEN '1:00 AM' THEN 4
      WHEN '2:00 AM' THEN 5
      ELSE 6
    END ASC
  `

  return NextResponse.json({ bookings })
}
