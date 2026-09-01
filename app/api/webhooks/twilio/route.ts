import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { setSmsOptInByPhone } from '@/lib/subscribers'

// Twilio's request-signing scheme: HMAC-SHA1 of the full webhook URL with
// every POST param (sorted by key, key+value concatenated) appended,
// base64-encoded. https://www.twilio.com/docs/usage/webhooks/webhooks-security
function isSignatureValid(url: string, params: Record<string, string>, header: string | null, authToken: string): boolean {
  if (!header) return false
  const data = Object.keys(params)
    .sort()
    .reduce((acc, key) => acc + key + params[key], url)
  const expected = crypto.createHmac('sha1', authToken).update(data, 'utf8').digest('base64')

  const expectedBuf = Buffer.from(expected)
  const receivedBuf = Buffer.from(header)
  if (expectedBuf.length !== receivedBuf.length) return false
  return crypto.timingSafeEqual(expectedBuf, receivedBuf)
}

export async function POST(request: Request) {
  const authToken = process.env.TWILIO_AUTH_TOKEN
  if (!authToken) {
    console.error('TWILIO_AUTH_TOKEN is not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const formData = await request.formData()
  const params: Record<string, string> = {}
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') params[key] = value
  }

  const signature = request.headers.get('x-twilio-signature')
  if (!isSignatureValid(request.url, params, signature, authToken)) {
    console.error('Twilio webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const from = params.From
  const body = (params.Body ?? '').trim().toUpperCase()

  if (from) {
    if (['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'].includes(body)) {
      await setSmsOptInByPhone(from, false)
    } else if (['START', 'YES', 'UNSTOP'].includes(body)) {
      await setSmsOptInByPhone(from, true)
    }
  }

  // Empty TwiML response — no auto-reply text (Twilio's Advanced Opt-Out
  // already sends its own STOP/START confirmation when enabled on the
  // Messaging Service; this webhook just mirrors the state into our DB).
  return new NextResponse('<Response></Response>', {
    headers: { 'Content-Type': 'text/xml' },
  })
}
