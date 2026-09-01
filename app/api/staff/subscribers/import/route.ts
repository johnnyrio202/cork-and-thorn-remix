import { NextResponse } from 'next/server'
import { getStaffUserIdFromRequest } from '@/lib/staff-auth'
import { importSubscribersFromCsv } from '@/lib/subscribers'

// Bulk imports (the 6,320-row email export and 3,000+-row SMS list) run
// synchronously here — it's a DB-only loop (no external API calls, those
// happen later via the Resend sync cron), so it comfortably fits inside a
// single request even at that size. If that stops being true, move this to
// a queued job instead of trying to make one request faster.
export async function POST(request: Request) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  const channel = form?.get('channel')
  if (!(file instanceof File) || (channel !== 'email' && channel !== 'sms')) {
    return NextResponse.json({ error: 'file and channel (email|sms) are required' }, { status: 400 })
  }

  const text = await file.text()
  const result = await importSubscribersFromCsv(text, channel, 'import_spothopper')
  return NextResponse.json(result)
}
