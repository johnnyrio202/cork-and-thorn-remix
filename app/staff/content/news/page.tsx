import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { STAFF_SESSION_COOKIE, verifySessionCookieValue } from '@/lib/staff-auth'
import { NewsAdmin } from '@/components/staff/content/news-admin'

export default async function NewsContentPage() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(STAFF_SESSION_COOKIE)?.value
  const userId = verifySessionCookieValue(sessionValue)
  if (!userId) {
    redirect('/staff/login')
  }

  return <NewsAdmin />
}
