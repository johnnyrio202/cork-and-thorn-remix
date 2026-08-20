import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { getSql } from '@/lib/db'
import { sendReservationDepositReceipt } from '@/lib/email'

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

  if (!isSignatureValid(rawBody, signatureHeader, secret)) {
    console.error('Clover webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const payload = JSON.parse(rawBody)
  console.log('Clover webhook payload:', JSON.stringify(payload))

  // Field casing isn't fully documented — accept the likely variants and
  // log the raw payload above so the real shape can be confirmed from logs.
  const status: string | undefined = payload.status ?? payload.Status
  const checkoutSessionId: string | undefined =
    payload.data ?? payload.Data ?? payload.checkoutSessionId ?? payload.checkoutSessionUuid

  if (!status || !checkoutSessionId) {
    console.error('Clover webhook missing expected fields:', payload)
    return NextResponse.json({ received: true })
  }

  const sql = getSql()

  if (status.toUpperCase() === 'APPROVED') {
    type DepositRow = {
      checkout_session_id: string
      tier_id: string
      reservation_date: string
      guest_name: string
      guest_email: string
    }
    const rows = (await sql`
      UPDATE reservation_deposits
      SET status = 'paid', paid_at = now()
      WHERE checkout_session_id = ${checkoutSessionId} AND status = 'pending'
      RETURNING checkout_session_id, tier_id, reservation_date, guest_name, guest_email
    `) as DepositRow[]
    const booking = rows[0]

    if (booking) {
      try {
        await sendReservationDepositReceipt(booking)
      } catch (err) {
        // Payment already recorded as paid — don't fail the webhook over email delivery.
        console.error('Failed to send reservation deposit receipt:', err)
      }
    }
  } else if (status.toUpperCase() === 'DECLINED') {
    await sql`
      UPDATE reservation_deposits
      SET status = 'failed'
      WHERE checkout_session_id = ${checkoutSessionId} AND status = 'pending'
    `
  }

  return NextResponse.json({ received: true })
}
