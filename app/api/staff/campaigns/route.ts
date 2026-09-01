import { NextResponse } from 'next/server'
import { getStaffUserIdFromRequest } from '@/lib/staff-auth'
import { CAMPAIGN_CHANNELS, createCampaign, listCampaigns, type CampaignChannel } from '@/lib/campaigns'

export async function GET(request: Request) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const campaigns = await listCampaigns()
  return NextResponse.json({ campaigns })
}

export async function POST(request: Request) {
  const staffId = getStaffUserIdFromRequest(request)
  if (!staffId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const name = body?.name
  const scheduledAt = typeof body?.scheduledAt === 'string' && body.scheduledAt ? body.scheduledAt : null
  const content = body?.content

  if (typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }
  if (!Array.isArray(content) || content.length === 0) {
    return NextResponse.json({ error: 'content (at least one channel) is required' }, { status: 400 })
  }
  for (const item of content) {
    if (!CAMPAIGN_CHANNELS.includes(item?.channel) || typeof item?.body !== 'string' || !item.body.trim()) {
      return NextResponse.json({ error: 'each content item needs a valid channel and non-empty body' }, { status: 400 })
    }
  }

  const campaign = await createCampaign({
    name,
    createdBy: staffId,
    scheduledAt,
    content: content.map((c: { channel: CampaignChannel; subject?: string; body: string; imageUrl?: string }) => ({
      channel: c.channel,
      subject: c.subject ?? null,
      body: c.body,
      imageUrl: c.imageUrl ?? null,
    })),
  })

  return NextResponse.json({ campaign }, { status: 201 })
}
