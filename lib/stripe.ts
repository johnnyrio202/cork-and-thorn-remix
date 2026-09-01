import 'server-only'
import Stripe from 'stripe'
import { products } from '@/lib/data'
import type { CartLineInput, CloverCheckoutSession } from '@/lib/clover'

let _stripe: Stripe | null = null

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY is not configured')
    _stripe = new Stripe(key)
  }
  return _stripe
}

function randomLabelSuffix(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  return Array.from({ length: 8 }, () => letters[Math.floor(Math.random() * letters.length)]).join('')
}

// Recomputes every line from the canonical product catalog server-side —
// never trusts a price the client sends — same invariant as
// lib/clover.ts's createHostedCheckoutSession. Returns the same
// {href, checkoutSessionId} shape Clover does, so /api/checkout can pick
// either provider without the caller (app-shell-header.tsx) knowing which.
export async function createStripeCheckoutSession(
  lines: CartLineInput[],
  siteUrl: string,
): Promise<CloverCheckoutSession> {
  if (lines.length === 0) {
    throw new Error('Cart is empty')
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = lines.map((line) => {
    const product = products.find((p) => p.id === line.id)
    if (!product) {
      throw new Error(`Unknown product: ${line.id}`)
    }
    if (!Number.isInteger(line.quantity) || line.quantity < 1) {
      throw new Error(`Invalid quantity for ${line.id}`)
    }
    return {
      price_data: {
        currency: 'usd',
        product_data: { name: product.name },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: line.quantity,
    }
  })

  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: `${siteUrl}/shop?checkout=success`,
    cancel_url: `${siteUrl}/shop?checkout=cancelled`,
    // Not yet in the bundled SDK's TS types (added on API version
    // 2026-03-25.dahlia+, which this SDK's default 2026-08-26.dahlia is
    // past) — the REST API accepts it regardless. Dashboard-only label,
    // no functional effect if dropped.
    integration_identifier: `corkandthorn_shop_${randomLabelSuffix()}`,
    // No payment_method_types — omitting it enables Stripe's dynamic
    // payment method selection instead of hardcoding to cards only.
  } as Stripe.Checkout.SessionCreateParams)

  if (!session.url) {
    throw new Error('Stripe did not return a checkout URL')
  }
  return { href: session.url, checkoutSessionId: session.id }
}

export { getStripe }
