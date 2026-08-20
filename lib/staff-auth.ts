import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'

const SESSION_COOKIE = 'staff_session'
const SESSION_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

function getSecret(): string {
  const secret = process.env.STAFF_SESSION_SECRET
  if (!secret) {
    throw new Error('STAFF_SESSION_SECRET is not configured')
  }
  return secret
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
}

export function createSessionCookieValue(userId: string): string {
  const exp = Date.now() + SESSION_TTL_MS
  const payload = `${userId}.${exp}`
  const signature = sign(payload)
  return Buffer.from(`${payload}.${signature}`).toString('base64url')
}

export function verifySessionCookieValue(value: string | undefined): string | null {
  if (!value) return null
  try {
    const decoded = Buffer.from(value, 'base64url').toString('utf8')
    const [userId, expStr, signature] = decoded.split('.')
    if (!userId || !expStr || !signature) return null

    const payload = `${userId}.${expStr}`
    const expected = sign(payload)
    const expectedBuf = Buffer.from(expected)
    const receivedBuf = Buffer.from(signature)
    if (expectedBuf.length !== receivedBuf.length) return null
    if (!crypto.timingSafeEqual(expectedBuf, receivedBuf)) return null

    if (Date.now() > Number(expStr)) return null

    return userId
  } catch {
    return null
  }
}

export const STAFF_SESSION_COOKIE = SESSION_COOKIE
export const STAFF_SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000

// Cookie parsing for use inside API route handlers (Request, not NextRequest).
export function getStaffUserIdFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') ?? ''
  const match = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`))
  if (!match) return null
  const value = match.slice(SESSION_COOKIE.length + 1)
  return verifySessionCookieValue(value)
}
