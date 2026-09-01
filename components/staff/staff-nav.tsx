'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/staff', label: 'Bookings' },
  { href: '/staff/inquiries', label: 'Inquiries' },
  { href: '/staff/content', label: 'Content' },
  { href: '/staff/campaigns', label: 'Campaigns' },
  { href: '/staff/subscribers', label: 'Subscribers' },
]

export function StaffNav() {
  const pathname = usePathname()
  return (
    <nav className="flex flex-wrap gap-4 text-sm">
      {LINKS.map((link) => {
        const active = link.href === '/staff' ? pathname === '/staff' : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={active ? 'text-foreground' : 'text-white/50 hover:text-white'}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
