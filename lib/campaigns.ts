import { getSql } from '@/lib/db'

export type CampaignChannel = 'website' | 'email' | 'sms'
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'archived'
export type CampaignContentStatus = 'pending' | 'approved' | 'rejected' | 'sent'

export type Campaign = {
  id: string
  name: string
  status: CampaignStatus
  scheduled_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type CampaignContent = {
  id: string
  campaign_id: string
  channel: CampaignChannel
  status: CampaignContentStatus
  subject: string | null
  body: string
  image_url: string | null
  news_post_id: string | null
  sent_at: string | null
}

export const CAMPAIGN_CHANNELS: CampaignChannel[] = ['website', 'email', 'sms']

export async function listCampaigns(): Promise<Campaign[]> {
  const sql = getSql()
  return (await sql`SELECT * FROM campaigns ORDER BY created_at DESC`) as Campaign[]
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const sql = getSql()
  const rows = (await sql`SELECT * FROM campaigns WHERE id = ${id} LIMIT 1`) as Campaign[]
  return rows[0] ?? null
}

export async function getCampaignContent(campaignId: string): Promise<CampaignContent[]> {
  const sql = getSql()
  return (await sql`
    SELECT * FROM campaign_content WHERE campaign_id = ${campaignId} ORDER BY channel ASC
  `) as CampaignContent[]
}

export async function createCampaign(input: {
  name: string
  createdBy: string | null
  scheduledAt: string | null
  content: { channel: CampaignChannel; subject?: string | null; body: string; imageUrl?: string | null }[]
}): Promise<Campaign> {
  const sql = getSql()
  const rows = (await sql`
    INSERT INTO campaigns (name, status, scheduled_at, created_by)
    VALUES (${input.name}, ${input.scheduledAt ? 'scheduled' : 'draft'}, ${input.scheduledAt}, ${input.createdBy})
    RETURNING *
  `) as Campaign[]
  const campaign = rows[0]

  for (const item of input.content) {
    await sql`
      INSERT INTO campaign_content (campaign_id, channel, subject, body, image_url)
      VALUES (${campaign.id}, ${item.channel}, ${item.subject ?? null}, ${item.body}, ${item.imageUrl ?? null})
      ON CONFLICT (campaign_id, channel) DO UPDATE SET
        subject = EXCLUDED.subject, body = EXCLUDED.body, image_url = EXCLUDED.image_url
    `
  }

  return campaign
}

export async function updateCampaignContent(
  campaignId: string,
  channel: CampaignChannel,
  input: { subject?: string | null; body: string; imageUrl?: string | null },
): Promise<void> {
  const sql = getSql()
  await sql`
    INSERT INTO campaign_content (campaign_id, channel, subject, body, image_url)
    VALUES (${campaignId}, ${channel}, ${input.subject ?? null}, ${input.body}, ${input.imageUrl ?? null})
    ON CONFLICT (campaign_id, channel) DO UPDATE SET
      subject = EXCLUDED.subject, body = EXCLUDED.body, image_url = EXCLUDED.image_url,
      status = 'pending', sent_at = NULL
  `
}

export async function markContentStatus(
  campaignId: string,
  channel: CampaignChannel,
  status: CampaignContentStatus,
  newsPostId?: string | null,
): Promise<void> {
  const sql = getSql()
  await sql`
    UPDATE campaign_content
    SET status = ${status},
        sent_at = CASE WHEN ${status} = 'sent' THEN now() ELSE sent_at END,
        news_post_id = COALESCE(${newsPostId ?? null}, news_post_id)
    WHERE campaign_id = ${campaignId} AND channel = ${channel}
  `
}
