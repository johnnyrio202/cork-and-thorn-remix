import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import {
  verifyPassword,
  createSessionCookieValue,
  STAFF_SESSION_COOKIE,
  STAFF_SESSION_MAX_AGE_SECONDS,
} from '@/lib/staff-auth'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = body?.email
  const password = body?.password

  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return NextResponse.json({ error: 'email and password are required' }, { status: 400 })
  }

  const sql = getSql()
  const rows = (await sql`
    SELECT id, password_hash FROM staff_users WHERE email = ${email.toLowerCase().trim()}
  `) as { id: string; password_hash: string }[]

  const user = rows[0]
  // Same generic error either way — don't reveal whether the email exists.
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const cookieValue = createSessionCookieValue(user.id)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(STAFF_SESSION_COOKIE, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: STAFF_SESSION_MAX_AGE_SECONDS,
    path: '/',
  })
  return res
}
