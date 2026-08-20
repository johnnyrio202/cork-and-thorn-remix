import { products, tableTiers, RESERVATION_DEPOSIT } from '@/lib/data'

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

export type ReservationDepositInput = {
  tierId: string
  date: string // YYYY-MM-DD, venue-local
}

// Deposit is flat-rate and weekend-only — amount and eligibility are both
// decided here from canonical data, never from the client, since this
// charges a real non-refundable fee.
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

  const day = parsedDate.getDay()
  if (!(RESERVATION_DEPOSIT.weekendDays as readonly number[]).includes(day)) {
    throw new Error('Deposit only required for Saturday/Sunday reservations')
  }

  return createHostedCheckoutSessionFromLineItems([
    {
      name: `${tier.name} Reservation Deposit (non-refundable)`,
      price: Math.round(RESERVATION_DEPOSIT.amount * 100),
      unitQty: 1,
    },
  ])
}
