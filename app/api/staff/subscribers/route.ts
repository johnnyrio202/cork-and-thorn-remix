import { NextResponse } from 'next/server'
import { getStaffUserIdFromRequest } from '@/lib/staff-auth'
import { addSubscriber, listSubscribers, subscriberCounts } from '@/lib/subscribers'

export async function GET(request: Request) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const url = new URL(request.url)
  const offset = Number(url.searchParams.get('offset') ?? 0)
  const [{ rows, total }, counts] = await Promise.all([listSubscribers(200, offset), subscriberCounts()])
  return NextResponse.json({ subscribers: rows, total, counts })
}

export async function POST(request: Request) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email : null
  const phone = typeof body?.phone === 'string' ? body.phone : null
  const name = typeof body?.name === 'string' ? body.name : null

  if (!email && !phone) {
    return NextResponse.json({ error: 'email or phone is required' }, { status: 400 })
  }

  const subscriber = await addSubscriber({ email, phone, name, source: 'manual' })
  if (!subscriber) {
    return NextResponse.json({ error: 'Unable to add subscriber' }, { status: 400 })
  }
  return NextResponse.json({ subscriber }, { status: 201 })
}
