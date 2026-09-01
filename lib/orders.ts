import { getSql } from '@/lib/db'
import { products } from '@/lib/data'
import type { CartLineInput } from '@/lib/clover'

export type OrderProvider = 'stripe' | 'clover'

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

export async function markOrderPaid(checkoutSessionId: string, customerEmail: string | null): Promise<void> {
  const sql = getSql()
  await sql`
    UPDATE orders SET
      status = 'paid',
      paid_at = now(),
      customer_email = COALESCE(${customerEmail}, customer_email)
    WHERE checkout_session_id = ${checkoutSessionId} AND status = 'pending'
  `
}

export async function markOrderFailed(checkoutSessionId: string): Promise<void> {
  const sql = getSql()
  await sql`
    UPDATE orders SET status = 'failed'
    WHERE checkout_session_id = ${checkoutSessionId} AND status = 'pending'
  `
}
