import { NextResponse } from 'next/server'
import { createReservationDepositSession } from '@/lib/clover'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const tierId = body?.tierId
  const date = body?.date

  if (typeof tierId !== 'string' || typeof date !== 'string') {
    return NextResponse.json(
      { error: 'tierId and date are required' },
      { status: 400 },
    )
  }

  try {
    const session = await createReservationDepositSession({ tierId, date })
    return NextResponse.json(session)
  } catch (err) {
    console.error('Reservation deposit error:', err)
    const message = err instanceof Error ? err.message : 'Unable to start deposit checkout'
    const isClientError =
      message.includes('Saturday/Sunday') ||
      message.includes('Unknown table tier') ||
      message.includes('Invalid date')
    return NextResponse.json(
      { error: isClientError ? message : 'Unable to start deposit checkout' },
      { status: isClientError ? 400 : 502 },
    )
  }
}
