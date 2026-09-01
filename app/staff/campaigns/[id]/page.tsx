import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { STAFF_SESSION_COOKIE, verifySessionCookieValue } from '@/lib/staff-auth'
import { CampaignDetail } from '@/components/staff/campaigns/campaign-detail'

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(STAFF_SESSION_COOKIE)?.value
  const userId = verifySessionCookieValue(sessionValue)
  if (!userId) {
    redirect('/staff/login')
  }

  const { id } = await params
  return <CampaignDetail campaignId={id} />
}
