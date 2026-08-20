import { NextResponse } from 'next/server'
import { STAFF_SESSION_COOKIE } from '@/lib/staff-auth'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(STAFF_SESSION_COOKIE, '', { maxAge: 0, path: '/' })
  return res
}
