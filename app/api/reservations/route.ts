import { NextResponse } from 'next/server'
import { createReservationDepositSession } from '@/lib/clover'
import { getSql } from '@/lib/db'
import { sendBookingConfirmation } from '@/lib/email'
import { isNightlifeSlot, NIGHTLIFE_SLOT } from '@/lib/data'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const tierId = body?.tierId
  const date = body?.date
  const time = body?.time
  const partySize = Number(body?.partySize)
  const guestName = body?.guestName
  const guestPhone = body?.guestPhone
  const guestEmail = body?.guestEmail

  if (
    typeof tierId !== 'string' ||
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
      { error: 'tierId, date, time, partySize, guestName, guestPhone, and guestEmail are required' },
      { status: 400 },
    )
  }

  const sql = getSql()
  const nightlife = isNightlifeSlot(date, time)

  try {
    if (!nightlife) {
      const rows = (await sql`
        INSERT INTO bookings
          (tier_id, reservation_date, arrival_time, party_size, guest_name, guest_phone, guest_email, status, confirmed_at)
        VALUES
          (${tierId}, ${date}, ${time}, ${partySize}, ${guestName}, ${guestPhone}, ${guestEmail}, 'confirmed', now())
        RETURNING tier_id, reservation_date, arrival_time, guest_name, guest_email
      `) as {
        tier_id: string
        reservation_date: string
        arrival_time: string
        guest_name: string
        guest_email: string
      }[]

      const booking = rows[0]
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

    await sql`
      INSERT INTO bookings
        (tier_id, reservation_date, arrival_time, party_size, guest_name, guest_phone, guest_email, promoter_code, deposit_amount_cents, checkout_session_id, status)
      VALUES
        (${tierId}, ${date}, ${time}, ${partySize}, ${guestName}, ${guestPhone}, ${guestEmail}, ${NIGHTLIFE_SLOT.promoterCode}, ${depositCents}, ${session.checkoutSessionId}, 'pending_deposit')
    `

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
