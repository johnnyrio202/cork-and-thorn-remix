import { NextResponse } from 'next/server'
import { createHostedCheckoutSession, type CartLineInput } from '@/lib/clover'

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

  try {
    const session = await createHostedCheckoutSession(parsedLines)
    return NextResponse.json(session)
  } catch (err) {
    console.error('Clover checkout error:', err)
    return NextResponse.json(
      { error: 'Unable to start checkout' },
      { status: 502 },
    )
  }
}
