import { NextResponse } from 'next/server'
import { getStaffUserIdFromRequest } from '@/lib/staff-auth'
import { setOptIn } from '@/lib/subscribers'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await request.json().catch(() => null)
  const channel = body?.channel
  const optedIn = body?.optedIn

  if ((channel !== 'email' && channel !== 'sms') || typeof optedIn !== 'boolean') {
    return NextResponse.json({ error: 'channel (email|sms) and optedIn (boolean) are required' }, { status: 400 })
  }

  await setOptIn(id, channel, optedIn)
  return NextResponse.json({ ok: true })
}
