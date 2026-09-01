import { NextResponse } from 'next/server'
import { createHostedCheckoutSession, type CartLineInput } from '@/lib/clover'
import { createStripeCheckoutSession } from '@/lib/stripe'
import { recordPendingOrder } from '@/lib/orders'

// Clover is the active payment rail — this only switches to Stripe when
// PAYMENTS_PROVIDER=stripe is explicitly set, which nothing sets by
// default. Stripe is a tested backup, not live: see docs/spothopper-gaps-analysis.csv.
function activeProvider(): 'stripe' | 'clover' {
  return process.env.PAYMENTS_PROVIDER === 'stripe' ? 'stripe' : 'clover'
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const lines = body?.lines

  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  const parsedLines: CartLineInput[] = lines.map((line) => ({
    id: String(line?.id ?? ''),
    quantity: Number(line?.quantity),
  }))

  const provider = activeProvider()

  try {
    if (provider === 'stripe') {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin
      const session = await createStripeCheckoutSession(parsedLines, siteUrl)
      await recordPendingOrder('stripe', session.checkoutSessionId, parsedLines)
      return NextResponse.json(session)
    }

    const session = await createHostedCheckoutSession(parsedLines)
    return NextResponse.json(session)
  } catch (err) {
    console.error(`${provider} checkout error:`, err)
    return NextResponse.json(
      { error: 'Unable to start checkout' },
      { status: 502 },
    )
  }
}
