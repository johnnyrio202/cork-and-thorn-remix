import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { getSql } from '@/lib/db'
import { sendBookingConfirmation } from '@/lib/email'

function isSignatureValid(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false
  const parts = Object.fromEntries(
    header.split(',').map((p) => p.split('=') as [string, string]),
  )
  const timestamp = parts.t
  const receivedHash = parts.v1
  if (!timestamp || !receivedHash) return false

  const expectedHash = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex')

  const expected = Buffer.from(expectedHash, 'hex')
  const received = Buffer.from(receivedHash, 'hex')
  if (expected.length !== received.length) return false
  return crypto.timingSafeEqual(expected, received)
}

export async function POST(request: Request) {
  const secret = process.env.CLOVER_WEBHOOK_SECRET
  if (!secret) {
    // Fail closed — never process an unverifiable webhook.
    console.error('CLOVER_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const rawBody = await request.text()
  const signatureHeader = request.headers.get('clover-signature')
  const sigValid = isSignatureValid(rawBody, signatureHeader, secret)

  // Temporary diagnostic log — records every attempt regardless of outcome,
  // so delivery can be confirmed even when logs/observability access is blocked.
  try {
    await getSql()`
      INSERT INTO webhook_requests (signature_header, signature_valid, raw_body)
      VALUES (${signatureHeader}, ${sigValid}, ${rawBody})
    `
  } catch (err) {
    console.error('Failed to log webhook request:', err)
  }

  if (!sigValid) {
    console.error('Clover webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const payload = JSON.parse(rawBody)

  // Confirmed against a real delivery: { type, id, merchantId, status,
  // message, checkoutSessionId } — Clover's docs describe this in prose
  // only and don't match this casing (they imply a "data" field).
  const status: string | undefined = payload.status
  const checkoutSessionId: string | undefined = payload.checkoutSessionId

  if (!status || !checkoutSessionId) {
    console.error('Clover webhook missing expected fields:', payload)
    return NextResponse.json({ received: true })
  }

  const sql = getSql()

  if (status.toUpperCase() === 'APPROVED') {
    type BookingRow = {
      checkout_session_id: string
      tier_id: string
      booth_id: string
      reservation_date: string
      arrival_time: string
      guest_name: string
      guest_email: string
      notes: string | null
      deposit_amount_cents: number | null
    }
    const rows = (await sql`
      UPDATE bookings
      SET status = 'confirmed', confirmed_at = now()
      WHERE checkout_session_id = ${checkoutSessionId} AND status = 'pending_deposit'
      RETURNING checkout_session_id, tier_id, booth_id, reservation_date, arrival_time, guest_name, guest_email, notes, deposit_amount_cents
    `) as BookingRow[]
    const booking = rows[0]

    if (booking) {
      try {
        await sendBookingConfirmation(booking)
      } catch (err) {
        // Payment already recorded as confirmed — don't fail the webhook over email delivery.
        console.error('Failed to send booking confirmation email:', err)
      }
    }
  } else if (status.toUpperCase() === 'DECLINED') {
    await sql`
      UPDATE bookings
      SET status = 'failed'
      WHERE checkout_session_id = ${checkoutSessionId} AND status = 'pending_deposit'
    `
  }

  return NextResponse.json({ received: true })
}
