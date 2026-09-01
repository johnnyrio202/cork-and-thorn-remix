import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { getStaffUserIdFromRequest } from '@/lib/staff-auth'
import { getCampaign, getCampaignContent, markContentStatus } from '@/lib/campaigns'
import { sendCampaignBroadcast } from '@/lib/resend-audience'
import { isSmsConfigured } from '@/lib/sms'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id: campaignId } = await params
  const body = await request.json().catch(() => null)
  const channel = body?.channel

  const campaign = await getCampaign(campaignId)
  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }
  const content = (await getCampaignContent(campaignId)).find((c) => c.channel === channel)
  if (!content) {
    return NextResponse.json({ error: `No ${channel} content on this campaign` }, { status: 404 })
  }

  const sql = getSql()

  try {
    if (channel === 'website') {
      const rows = (await sql`
        INSERT INTO news (title, body, image_url, published)
        VALUES (${content.subject || campaign.name}, ${content.body}, ${content.image_url ?? ''}, true)
        RETURNING id
      `) as { id: string }[]
      await markContentStatus(campaignId, 'website', 'sent', rows[0].id)
      return NextResponse.json({ ok: true, newsPostId: rows[0].id })
    }

    if (channel === 'email') {
      const broadcast = await sendCampaignBroadcast({
        subject: content.subject || campaign.name,
        html: content.body,
        scheduledAt: campaign.scheduled_at,
      })
      await markContentStatus(campaignId, 'email', 'sent')
      return NextResponse.json({ ok: true, broadcastId: broadcast.id })
    }

    if (channel === 'sms') {
      if (!isSmsConfigured()) {
        await markContentStatus(campaignId, 'sms', 'approved')
        return NextResponse.json({ ok: true, smsConfigured: false })
      }
      const queued = (await sql`
        INSERT INTO campaign_sms_sends (campaign_id, subscriber_id)
        SELECT ${campaignId}, id FROM subscribers WHERE phone IS NOT NULL AND sms_opt_in = true
        RETURNING id
      `) as { id: string }[]
      await markContentStatus(campaignId, 'sms', 'approved')
      return NextResponse.json({ ok: true, smsConfigured: true, queued: queued.length })
    }

    return NextResponse.json({ error: `Unknown channel: ${channel}` }, { status: 400 })
  } catch (err) {
    console.error(`Failed to approve ${channel} for campaign ${campaignId}:`, err)
    const message = err instanceof Error ? err.message : 'Unable to send'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
