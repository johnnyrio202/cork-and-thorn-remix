import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { STAFF_SESSION_COOKIE, verifySessionCookieValue } from '@/lib/staff-auth'
import { StaffNav } from '@/components/staff/staff-nav'

const SECTIONS = [
  { href: '/staff/content/events', title: 'Events', description: 'Create, edit, and publish upcoming events.' },
  { href: '/staff/content/news', title: 'News', description: 'Post updates and announcements.' },
  { href: '/staff/content/gallery', title: 'Gallery', description: 'Upload and reorder photos.' },
]

export default async function ContentHubPage() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(STAFF_SESSION_COOKIE)?.value
  const userId = verifySessionCookieValue(sessionValue)
  if (!userId) {
    redirect('/staff/login')
  }

  return (
    <div className="min-h-screen bg-[#0B111B] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-heading text-3xl tracking-wide text-foreground">Content</h1>
            <StaffNav />
          </div>
          <Link href="/staff" className="text-sm text-white/60 hover:text-white">
            ← Back to dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-2xl border border-white/10 bg-card p-6 transition-colors hover:border-primary/40"
            >
              <h2 className="font-heading text-xl text-foreground">{section.title}</h2>
              <p className="mt-2 text-sm text-white/50">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
