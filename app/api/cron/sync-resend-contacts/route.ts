import { NextResponse } from 'next/server'
import { syncPendingSubscribersToResend } from '@/lib/resend-audience'

// Drains subscribers with no resend_contact_id yet into the Resend
// segment, a handful per tick — keeps a 6,000-row CSV import from trying
// to make 6,000 Resend API calls inside one request.
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await syncPendingSubscribersToResend(25)
  return NextResponse.json(result)
}
