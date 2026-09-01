import crypto from 'node:crypto'
import { getSql } from '@/lib/db'
import { products } from '@/lib/data'
import type { CartLineInput } from '@/lib/clover'

export type OrderProvider = 'stripe' | 'clover' | 'free'
export type OrderStatus = 'pending' | 'paid' | 'failed'

export type OrderLineItem = { id: string; name: string; price: number; quantity: number }

export type Order = {
  id: string
  provider: OrderProvider
  checkout_session_id: string
  status: OrderStatus
  line_items: OrderLineItem[]
  amount_total_cents: number
  customer_email: string | null
  event_id: string | null
  created_at: string
  paid_at: string | null
}

// Snapshots line items from the canonical catalog at purchase time (name/
// price as they were then, not a live join against `products`), so an
// order's record stays accurate even if the catalog changes later.
export async function recordPendingOrder(
  provider: OrderProvider,
  checkoutSessionId: string,
  lines: CartLineInput[],
): Promise<void> {
  const items = lines.map((line) => {
    const product = products.find((p) => p.id === line.id)
    if (!product) throw new Error(`Unknown product: ${line.id}`)
    return { id: line.id, name: product.name, price: product.price, quantity: line.quantity }
  })
  const amountTotalCents = Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100)

  const sql = getSql()
  await sql`
    INSERT INTO orders (provider, checkout_session_id, status, line_items, amount_total_cents)
    VALUES (${provider}, ${checkoutSessionId}, 'pending', ${JSON.stringify(items)}::jsonb, ${amountTotalCents})
  `
}

// Separate from recordPendingOrder rather than sharing one function with
// an optional eventId — ticket line items come from the events table,
// not the shop's `products` catalog, and there's only ever exactly one
// line (this event, this quantity), not a cart array.
//
// customerEmail is captured here from the purchase form, not left for
// the webhook to fill in — Stripe's Checkout Session collects an email
// itself (session.customer_details.email), but Clover's hosted checkout
// doesn't guarantee one back, which would otherwise silently break
// sendTicketConfirmation for the active default provider.
export async function recordPendingTicketOrder(
  provider: OrderProvider,
  checkoutSessionId: string,
  event: { id: string; title: string; price: number },
  quantity: number,
  customerEmail: string,
): Promise<void> {
  const items: OrderLineItem[] = [{ id: event.id, name: event.title, price: event.price, quantity }]
  const amountTotalCents = Math.round(event.price * quantity * 100)

  const sql = getSql()
  await sql`
    INSERT INTO orders (provider, checkout_session_id, status, line_items, amount_total_cents, event_id, customer_email)
    VALUES (${provider}, ${checkoutSessionId}, 'pending', ${JSON.stringify(items)}::jsonb, ${amountTotalCents}, ${event.id}, ${customerEmail})
  `
}

// Free events (price = 0, the schema default for every event until
// staff sets one) skip the payment provider entirely — a $0 total isn't
// a real checkout, and routing it through Clover/Stripe anyway would be
// broken UX at best, a rejected request at worst. This records the
// "order" as already paid with a synthetic session id instead.
export async function recordFreeTicketOrder(
  event: { id: string; title: string },
  quantity: number,
  customerEmail: string,
): Promise<Order> {
  const items: OrderLineItem[] = [{ id: event.id, name: event.title, price: 0, quantity }]
  const checkoutSessionId = `free_${crypto.randomUUID()}`

  const sql = getSql()
  const rows = (await sql`
    INSERT INTO orders (provider, checkout_session_id, status, line_items, amount_total_cents, event_id, customer_email, paid_at)
    VALUES ('free', ${checkoutSessionId}, 'paid', ${JSON.stringify(items)}::jsonb, 0, ${event.id}, ${customerEmail}, now())
    RETURNING *
  `) as Order[]
  return rows[0]
}

export async function markOrderPaid(checkoutSessionId: string, customerEmail: string | null): Promise<Order | null> {
  const sql = getSql()
  const rows = (await sql`
    UPDATE orders SET
      status = 'paid',
      paid_at = now(),
      customer_email = COALESCE(${customerEmail}, customer_email)
    WHERE checkout_session_id = ${checkoutSessionId} AND status = 'pending'
    RETURNING *
  `) as Order[]
  return rows[0] ?? null
}

export async function markOrderFailed(checkoutSessionId: string): Promise<Order | null> {
  const sql = getSql()
  const rows = (await sql`
    UPDATE orders SET status = 'failed'
    WHERE checkout_session_id = ${checkoutSessionId} AND status = 'pending'
    RETURNING *
  `) as Order[]
  return rows[0] ?? null
}

// Paid orders, plus pending ones from the last 20 minutes (same
// oversell-race guard as app/api/reservations/route.ts's booth check).
export async function ticketsSoldOrHeld(eventId: string): Promise<number> {
  const sql = getSql()
  const rows = (await sql`
    SELECT COALESCE(SUM((item->>'quantity')::int), 0) AS qty
    FROM orders, jsonb_array_elements(line_items) AS item
    WHERE event_id = ${eventId}
      AND (status = 'paid' OR (status = 'pending' AND created_at > now() - interval '20 minutes'))
  `) as { qty: number | string }[]
  // SUM() comes back as a string from the Neon driver, same as numeric
  // columns — caught by a real test here after it silently turned
  // `held + quantity` into string concatenation ('1' + 1 = '11').
  return Number(rows[0]?.qty ?? 0)
}
