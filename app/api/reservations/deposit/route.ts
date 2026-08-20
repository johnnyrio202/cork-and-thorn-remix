import { NextResponse } from 'next/server'
import { createReservationDepositSession } from '@/lib/clover'
import { getSql } from '@/lib/db'
import { RESERVATION_DEPOSIT } from '@/lib/data'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const tierId = body?.tierId
  const date = body?.date
  const guestName = body?.guestName
  const guestPhone = body?.guestPhone
  const guestEmail = body?.guestEmail

  if (
    typeof tierId !== 'string' ||
    typeof date !== 'string' ||
    typeof guestName !== 'string' ||
    typeof guestPhone !== 'string' ||
    typeof guestEmail !== 'string' ||
    !guestName.trim() ||
    !guestPhone.trim() ||
    !guestEmail.trim()
  ) {
    return NextResponse.json(
      { error: 'tierId, date, guestName, guestPhone, and guestEmail are required' },
      { status: 400 },
    )
  }

  try {
    const session = await createReservationDepositSession({ tierId, date })

    const sql = getSql()
    await sql`
      INSERT INTO reservation_deposits
        (checkout_session_id, tier_id, reservation_date, deposit_amount_cents, guest_name, guest_phone, guest_email)
      VALUES
        (${session.checkoutSessionId}, ${tierId}, ${date}, ${Math.round(RESERVATION_DEPOSIT.amount * 100)}, ${guestName}, ${guestPhone}, ${guestEmail})
    `

    return NextResponse.json(session)
  } catch (err) {
    console.error('Reservation deposit error:', err)
    const message = err instanceof Error ? err.message : 'Unable to start deposit checkout'
    const isClientError =
      message.includes('Saturday/Sunday') ||
      message.includes('Unknown table tier') ||
      message.includes('Invalid date')
    return NextResponse.json(
      { error: isClientError ? message : 'Unable to start deposit checkout' },
      { status: isClientError ? 400 : 502 },
    )
  }
}
