import { products, tableTiers, NIGHTLIFE_SLOT, isNightlifeSlot } from '@/lib/data'
import { getSql } from '@/lib/db'

const CLOVER_API_BASE_URL =
  process.env.CLOVER_API_BASE_URL ?? 'https://apisandbox.dev.clover.com'

export type CartLineInput = { id: string; quantity: number }

export type CloverCheckoutSession = {
  href: string
  checkoutSessionId: string
}

type CloverLineItem = {
  name: string
  price: number // cents
  unitQty: number
}

async function createHostedCheckoutSessionFromLineItems(
  lineItems: CloverLineItem[],
): Promise<CloverCheckoutSession> {
  const merchantId = process.env.CLOVER_MERCHANT_ID
  const privateToken = process.env.CLOVER_PRIVATE_TOKEN
  if (!merchantId || !privateToken) {
    throw new Error('Clover credentials are not configured')
  }

  if (lineItems.length === 0) {
    throw new Error('No line items to charge')
  }

  const res = await fetch(
    `${CLOVER_API_BASE_URL}/invoicingcheckoutservice/v1/checkouts`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Clover-Merchant-Id': merchantId,
        Authorization: `Bearer ${privateToken}`,
      },
      body: JSON.stringify({
        customer: {},
        shoppingCart: { lineItems },
      }),
    },
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Clover checkout session failed (${res.status}): ${body}`)
  }

  const data = await res.json()
  return { href: data.href, checkoutSessionId: data.checkoutSessionId }
}

// Recomputes every line from the canonical product catalog server-side —
// never trusts a price the client sends, so the cart total can't be tampered with.
export async function createHostedCheckoutSession(
  lines: CartLineInput[],
): Promise<CloverCheckoutSession> {
  if (lines.length === 0) {
    throw new Error('Cart is empty')
  }

  const lineItems = lines.map((line) => {
    const product = products.find((p) => p.id === line.id)
    if (!product) {
      throw new Error(`Unknown product: ${line.id}`)
    }
    if (!Number.isInteger(line.quantity) || line.quantity < 1) {
      throw new Error(`Invalid quantity for ${line.id}`)
    }
    return {
      name: product.name,
      price: Math.round(product.price * 100),
      unitQty: line.quantity,
    }
  })

  return createHostedCheckoutSessionFromLineItems(lineItems)
}

export type TicketCheckoutInput = { eventId: string; quantity: number }
export type TicketEvent = { id: string; title: string; price: number; capacity: number | null }

// Looks the event up server-side rather than trusting a client-sent
// price/title — same invariant as createHostedCheckoutSession above.
// Capacity is checked by the caller (app/api/checkout/tickets/route.ts),
// not here, since that also needs to run before Clover is ever called.
export async function createTicketCheckoutSession(
  input: TicketCheckoutInput,
): Promise<{ session: CloverCheckoutSession; event: TicketEvent }> {
  if (!Number.isInteger(input.quantity) || input.quantity < 1) {
    throw new Error('Invalid ticket quantity')
  }

  const sql = getSql()
  const rows = (await sql`
    SELECT id, title, price, capacity FROM events WHERE id = ${input.eventId} AND published = true LIMIT 1
  `) as TicketEvent[]
  const row = rows[0]
  if (!row) {
    throw new Error('Event not found')
  }
  // numeric columns come back as strings from the Neon driver, not JS
  // numbers, despite TicketEvent's declared type.
  const event: TicketEvent = { ...row, price: Number(row.price) }

  const session = await createHostedCheckoutSessionFromLineItems([
    { name: `${event.title} — Ticket`, price: Math.round(event.price * 100), unitQty: input.quantity },
  ])
  return { session, event }
}

export type ReservationDepositInput = {
  tierId: string
  date: string // YYYY-MM-DD, venue-local
  time: string // e.g. "11:00 PM"
}

// Deposit only applies to the Friday/Saturday 11pm-3am Nightlife slot —
// eligibility and amount are both decided here from canonical data, never
// from the client, since this charges a real non-refundable fee.
export async function createReservationDepositSession(
  input: ReservationDepositInput,
): Promise<CloverCheckoutSession> {
  const tier = tableTiers.find((t) => t.id === input.tierId)
  if (!tier) {
    throw new Error(`Unknown table tier: ${input.tierId}`)
  }

  const parsedDate = new Date(`${input.date}T00:00:00`)
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date: ${input.date}`)
  }

  if (!isNightlifeSlot(input.date, input.time)) {
    throw new Error('Deposit only required for the Friday/Saturday Nightlife slot (11pm-3am)')
  }

  return createHostedCheckoutSessionFromLineItems([
    {
      name: `${tier.name} Nightlife Reservation Deposit (non-refundable)`,
      price: Math.round(NIGHTLIFE_SLOT.depositAmount * 100),
      unitQty: 1,
    },
  ])
}
