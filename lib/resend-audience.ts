import { Resend } from 'resend'
import { getSql } from '@/lib/db'

let _resend: Resend | null = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!)
  return _resend
}

const SEGMENT_NAME = 'Cork & Thorn Subscribers'
let _segmentId: string | null = null

// Resend renamed "Audiences" to "Segments" — resend.segments is the
// current API (resend.audiences is a deprecated alias for the same
// class). We look the segment up by name instead of hardcoding an id via
// env, so there's nothing extra to configure — it's created once on
// first use and cached per warm invocation.
export async function getOrCreateSegmentId(): Promise<string> {
  if (_segmentId) return _segmentId
  const resend = getResend()

  const list = await resend.segments.list()
  const existing = list.data?.data?.find((s) => s.name === SEGMENT_NAME)
  if (existing) {
    _segmentId = existing.id
    return existing.id
  }

  const created = await resend.segments.create({ name: SEGMENT_NAME })
  if (!created.data) throw new Error(created.error?.message ?? 'Failed to create Resend segment')
  _segmentId = created.data.id
  return created.data.id
}

// Pulls up to `batchSize` subscribers that haven't been pushed to Resend
// yet (resend_contact_id IS NULL) and creates them as contacts in the
// segment. Meant to be driven by a cron tick, not called synchronously
// from a request — a 6,000+ row CSV import would blow past any request
// timeout if it tried to sync everything inline.
export async function syncPendingSubscribersToResend(batchSize = 25): Promise<{ synced: number; failed: number }> {
  const sql = getSql()
  const pending = (await sql`
    SELECT id, email, name FROM subscribers
    WHERE email IS NOT NULL AND email_opt_in = true AND resend_contact_id IS NULL
    LIMIT ${batchSize}
  `) as { id: string; email: string; name: string | null }[]

  if (pending.length === 0) return { synced: 0, failed: 0 }

  const segmentId = await getOrCreateSegmentId()
  const resend = getResend()
  let synced = 0
  let failed = 0

  for (const sub of pending) {
    try {
      const result = await resend.contacts.create({
        email: sub.email,
        firstName: sub.name ?? undefined,
        segments: [{ id: segmentId }],
      })
      const contactId = result.data?.id ?? 'exists'
      if (!result.data && !/already exists|already a contact/i.test(result.error?.message ?? '')) {
        throw new Error(result.error?.message ?? 'Unknown Resend error')
      }
      await sql`UPDATE subscribers SET resend_contact_id = ${contactId} WHERE id = ${sub.id}`
      synced++
    } catch (err) {
      console.error(`Resend contact sync failed for subscriber ${sub.id}:`, err)
      failed++
    }
  }

  return { synced, failed }
}

export async function sendCampaignBroadcast(input: {
  subject: string
  html: string
  scheduledAt?: string | null
}): Promise<{ id: string }> {
  const segmentId = await getOrCreateSegmentId()
  const resend = getResend()

  const result = await resend.broadcasts.create({
    from: 'Cork & Thorn <onboarding@resend.dev>',
    subject: input.subject,
    html: input.html,
    segmentId,
    send: true,
    ...(input.scheduledAt ? { scheduledAt: input.scheduledAt } : {}),
  })

  if (!result.data) throw new Error(result.error?.message ?? 'Failed to send broadcast')
  return result.data
}
