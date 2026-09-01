import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { getStaffUserIdFromRequest } from '@/lib/staff-auth'
import { CAMPAIGN_CHANNELS, getCampaign, getCampaignContent, updateCampaignContent } from '@/lib/campaigns'
import { isSmsConfigured } from '@/lib/sms'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const campaign = await getCampaign(id)
  if (!campaign) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const content = await getCampaignContent(id)

  const sql = getSql()
  const smsStatsRows = (await sql`
    SELECT status, count(*)::int AS count FROM campaign_sms_sends WHERE campaign_id = ${id} GROUP BY status
  `) as { status: string; count: number }[]
  const smsStats = { queued: 0, sent: 0, failed: 0, ...Object.fromEntries(smsStatsRows.map((r) => [r.status, r.count])) }

  return NextResponse.json({ campaign, content, smsStats, smsConfigured: isSmsConfigured() })
}

// Edits one channel's content. Approving/sending is a separate endpoint
// (approve/route.ts) since it has real side effects (publishing, sending
// mail/SMS) that shouldn't happen as a side effect of a content edit.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await request.json().catch(() => null)
  const channel = body?.channel

  if (!CAMPAIGN_CHANNELS.includes(channel) || typeof body?.body !== 'string' || !body.body.trim()) {
    return NextResponse.json({ error: 'channel and non-empty body are required' }, { status: 400 })
  }

  await updateCampaignContent(id, channel, {
    subject: body.subject ?? null,
    body: body.body,
    imageUrl: body.imageUrl ?? null,
  })
  return NextResponse.json({ ok: true })
}
