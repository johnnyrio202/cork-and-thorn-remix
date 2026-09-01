import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { createTicketCheckoutSession, type TicketEvent } from '@/lib/clover'
import { createTicketStripeCheckoutSession } from '@/lib/stripe'
import { recordFreeTicketOrder, recordPendingTicketOrder, ticketsSoldOrHeld } from '@/lib/orders'
import { sendTicketConfirmation } from '@/lib/email'

function activeProvider(): 'stripe' | 'clover' {
  return process.env.PAYMENTS_PROVIDER === 'stripe' ? 'stripe' : 'clover'
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const eventId = body?.eventId
  const quantity = Number(body?.quantity)
  const email = body?.email

  if (typeof eventId !== 'string' || !eventId) {
    return NextResponse.json({ error: 'eventId is required' }, { status: 400 })
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return NextResponse.json({ error: 'quantity must be a positive integer' }, { status: 400 })
  }
  if (typeof email !== 'string' || !email.trim()) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }

  try {
    const sql = getSql()
    const rows = (await sql`
      SELECT id, title, price, capacity FROM events WHERE id = ${eventId} AND published = true LIMIT 1
    `) as TicketEvent[]
    const row = rows[0]
    if (!row) {
      return NextResponse.json({ error: 'Event not found' }, { status: 400 })
    }
    // The Neon driver returns `numeric` columns as strings (precision
    // safety), not JS numbers, despite TicketEvent's type — coerce once
    // here rather than risk a strict `=== 0` silently never matching.
    const event: TicketEvent = { ...row, price: Number(row.price) }

    const held = await ticketsSoldOrHeld(eventId)
    if (event.capacity !== null && held + quantity > event.capacity) {
      return NextResponse.json({ error: 'Not enough tickets remaining' }, { status: 409 })
    }

    // $0 is the schema default for every event until staff sets a real
    // price — routing that through a real payment checkout would be
    // broken UX at best, a rejected request at worst.
    if (event.price === 0) {
      const order = await recordFreeTicketOrder(event, quantity, email)
      try {
        await sendTicketConfirmation(order)
      } catch (err) {
        console.error('Failed to send free ticket confirmation email:', err)
      }
      return NextResponse.json({ free: true })
    }

    const provider = activeProvider()
    if (provider === 'stripe') {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin
      const { session } = await createTicketStripeCheckoutSession({ eventId, quantity }, siteUrl)
      await recordPendingTicketOrder('stripe', session.checkoutSessionId, event, quantity, email)
      return NextResponse.json(session)
    }

    const { session } = await createTicketCheckoutSession({ eventId, quantity })
    await recordPendingTicketOrder('clover', session.checkoutSessionId, event, quantity, email)
    return NextResponse.json(session)
  } catch (err) {
    console.error('Ticket checkout error:', err)
    const message = err instanceof Error ? err.message : 'Unable to start checkout'
    const isClientError = message === 'Event not found' || message === 'Invalid ticket quantity'
    return NextResponse.json({ error: isClientError ? message : 'Unable to start checkout' }, { status: isClientError ? 400 : 502 })
  }
}
