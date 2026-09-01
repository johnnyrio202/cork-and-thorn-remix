import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { isSmsConfigured, sendSms } from '@/lib/sms'

// Drains a small batch of `campaign_sms_sends` rows per tick. Twilio has no
// "send to this whole list" call the way Resend Broadcasts does, so bulk
// SMS goes through this queue+cron instead of one long-running loop that
// would blow past a request timeout (and hit Twilio per-second rate limits
// if it tried to fire 3,000 messages at once).
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSmsConfigured()) {
    return NextResponse.json({ processed: 0, reason: 'sms_not_configured' })
  }

  const sql = getSql()
  const batch = (await sql`
    SELECT s.id, sub.phone, cc.body
    FROM campaign_sms_sends s
    JOIN subscribers sub ON sub.id = s.subscriber_id
    JOIN campaign_content cc ON cc.campaign_id = s.campaign_id AND cc.channel = 'sms'
    WHERE s.status = 'queued'
    ORDER BY s.created_at ASC
    LIMIT 20
  `) as { id: string; phone: string; body: string }[]

  let sent = 0
  let failed = 0

  for (const row of batch) {
    try {
      const result = await sendSms(row.phone, row.body)
      await sql`
        UPDATE campaign_sms_sends SET status = 'sent', provider_message_id = ${result.sid}, sent_at = now()
        WHERE id = ${row.id}
      `
      sent++
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      await sql`UPDATE campaign_sms_sends SET status = 'failed', error = ${message} WHERE id = ${row.id}`
      failed++
    }
  }

  return NextResponse.json({ processed: batch.length, sent, failed })
}
