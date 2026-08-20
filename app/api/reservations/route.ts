import { NextResponse } from 'next/server'
import { createReservationDepositSession } from '@/lib/clover'
import { getSql } from '@/lib/db'
import { sendBookingConfirmation } from '@/lib/email'
import {
  isNightlifeSlot,
  NIGHTLIFE_SLOT,
  BOOTHS,
  RESERVATION_DURATION_HOURS,
  normalizeNightHour,
} from '@/lib/data'

// Same CASE mapping as app/api/availability/route.ts — kept in sync by hand
// since it's a fixed, small set of known arrival_time values. Raw SQL text,
// not a parameter, so it's spliced via sql.unsafe() rather than ${}.
const ARRIVAL_HOUR_CASE = `CASE arrival_time
  WHEN '9:00 PM' THEN 21
  WHEN '10:00 PM' THEN 22
  WHEN '11:00 PM' THEN 23
  WHEN '12:00 AM' THEN 24
  WHEN '1:00 AM' THEN 25
  WHEN '2:00 AM' THEN 26
END`

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const boothId = body?.boothId
  const date = body?.date
  const time = body?.time
  const partySize = Number(body?.partySize)
  const guestName = body?.guestName
  const guestPhone = body?.guestPhone
  const guestEmail = body?.guestEmail
  const notes = typeof body?.notes === 'string' && body.notes.trim() ? body.notes.trim() : null

  if (
    typeof boothId !== 'string' ||
    typeof date !== 'string' ||
    typeof time !== 'string' ||
    !Number.isInteger(partySize) ||
    partySize < 1 ||
    typeof guestName !== 'string' ||
    typeof guestPhone !== 'string' ||
    typeof guestEmail !== 'string' ||
    !guestName.trim() ||
    !guestPhone.trim() ||
    !guestEmail.trim()
  ) {
    return NextResponse.json(
      { error: 'boothId, date, time, partySize, guestName, guestPhone, and guestEmail are required' },
      { status: 400 },
    )
  }

  const booth = BOOTHS.find((b) => b.id === boothId)
  if (!booth) {
    return NextResponse.json({ error: `Unknown booth: ${boothId}` }, { status: 400 })
  }

  const requestedHour = normalizeNightHour(time)
  if (requestedHour === undefined) {
    return NextResponse.json({ error: `Invalid time: ${time}` }, { status: 400 })
  }

  const sql = getSql()
  const nightlife = isNightlifeSlot(date, time)
  const tierId = booth.tier
  const hourCase = sql.unsafe(ARRIVAL_HOUR_CASE)

  // Fast pre-check so an already-taken booth fails before we bother
  // creating a Clover session. The real guard against a race (two guests
  // booking the same booth/overlapping window at once) is the
  // WHERE NOT EXISTS on the insert itself below, not this.
  const existing = (await sql`
    SELECT 1 FROM bookings
    WHERE booth_id = ${boothId} AND reservation_date = ${date}
      AND (status = 'confirmed' OR (status = 'pending_deposit' AND created_at > now() - interval '20 minutes'))
      AND abs((${hourCase}) - ${requestedHour}) < ${RESERVATION_DURATION_HOURS}
    LIMIT 1
  `) as unknown[]
  if (existing.length > 0) {
    return NextResponse.json(
      { error: 'That table is already booked around this time. Please pick another table or time.' },
      { status: 409 },
    )
  }

  try {
    if (!nightlife) {
      const rows = (await sql`
        INSERT INTO bookings
          (tier_id, booth_id, reservation_date, arrival_time, party_size, guest_name, guest_phone, guest_email, notes, status, confirmed_at)
        SELECT ${tierId}, ${boothId}, ${date}, ${time}, ${partySize}, ${guestName}, ${guestPhone}, ${guestEmail}, ${notes}, 'confirmed', now()
        WHERE NOT EXISTS (
          SELECT 1 FROM bookings
          WHERE booth_id = ${boothId} AND reservation_date = ${date}
            AND (status = 'confirmed' OR (status = 'pending_deposit' AND created_at > now() - interval '20 minutes'))
            AND abs((${hourCase}) - ${requestedHour}) < ${RESERVATION_DURATION_HOURS}
        )
        RETURNING tier_id, booth_id, reservation_date, arrival_time, guest_name, guest_email, notes
      `) as {
        tier_id: string
        booth_id: string
        reservation_date: string
        arrival_time: string
        guest_name: string
        guest_email: string
        notes: string | null
      }[]

      const booking = rows[0]
      if (!booking) {
        return NextResponse.json(
          { error: 'That table is already booked around this time. Please pick another table or time.' },
          { status: 409 },
        )
      }

      try {
        await sendBookingConfirmation({
          ...booking,
          deposit_amount_cents: null,
          checkout_session_id: null,
        })
      } catch (err) {
        console.error('Failed to send booking confirmation email:', err)
      }

      return NextResponse.json({ confirmed: true })
    }

    const session = await createReservationDepositSession({ tierId, date, time })
    const depositCents = Math.round(NIGHTLIFE_SLOT.depositAmount * 100)

    const rows = (await sql`
      INSERT INTO bookings
        (tier_id, booth_id, reservation_date, arrival_time, party_size, guest_name, guest_phone, guest_email, notes, promoter_code, deposit_amount_cents, checkout_session_id, status)
      SELECT ${tierId}, ${boothId}, ${date}, ${time}, ${partySize}, ${guestName}, ${guestPhone}, ${guestEmail}, ${notes}, ${NIGHTLIFE_SLOT.promoterCode}, ${depositCents}, ${session.checkoutSessionId}, 'pending_deposit'
      WHERE NOT EXISTS (
        SELECT 1 FROM bookings
        WHERE booth_id = ${boothId} AND reservation_date = ${date}
          AND (status = 'confirmed' OR (status = 'pending_deposit' AND created_at > now() - interval '20 minutes'))
          AND abs((${hourCase}) - ${requestedHour}) < ${RESERVATION_DURATION_HOURS}
      )
      RETURNING id
    `) as { id: string }[]

    if (rows.length === 0) {
      // Lost the race — the Clover session is created but unattached and
      // will simply expire unused (no charge happened, nothing to undo).
      return NextResponse.json(
        { error: 'That table is already booked around this time. Please pick another table or time.' },
        { status: 409 },
      )
    }

    return NextResponse.json(session)
  } catch (err) {
    console.error('Reservation error:', err)
    const message = err instanceof Error ? err.message : 'Unable to complete reservation'
    const isClientError =
      message.includes('Nightlife') || message.includes('Unknown table tier') || message.includes('Invalid date')
    return NextResponse.json(
      { error: isClientError ? message : 'Unable to complete reservation' },
      { status: isClientError ? 400 : 502 },
    )
  }
}
