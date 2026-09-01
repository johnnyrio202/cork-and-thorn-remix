import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { markOrderFailed, markOrderPaid } from '@/lib/orders'

// Fulfillment must be driven from this handler, not the success page — a
// customer can pay and lose their connection before /shop?checkout=success
// loads, which would silently drop the order if that page were the only
// place recording it. Handles checkout.session.completed (most payment
// methods) and checkout.session.async_payment_succeeded (delayed-notification
// methods, e.g. some bank debits) — gated on payment_status !== 'unpaid'
// since `completed` can fire while a delayed method is still unpaid.
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    // Fail closed — never process an unverifiable webhook.
    console.error('STRIPE_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature ?? '', webhookSecret)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.payment_status !== 'unpaid') {
      await markOrderPaid(session.id, session.customer_details?.email ?? null)
    }
  } else if (event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object as Stripe.Checkout.Session
    await markOrderFailed(session.id)
  } else if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session
    await markOrderFailed(session.id)
  }

  return NextResponse.json({ received: true })
}
