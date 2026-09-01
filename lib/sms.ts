// Thin Twilio wrapper, no SDK dependency (just the REST API over fetch) so
// nothing new goes in package.json until there's a real account to use it
// with. Every function is safe to call with no credentials configured —
// callers should check isSmsConfigured() first to show an honest "not
// connected" state instead of a silent no-op.

export function isSmsConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_MESSAGING_SERVICE_SID,
  )
}

export async function sendSms(to: string, body: string): Promise<{ sid: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID
  if (!accountSid || !authToken || !messagingServiceSid) {
    throw new Error('Twilio is not configured (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_MESSAGING_SERVICE_SID)')
  }

  const params = new URLSearchParams({ To: to, MessagingServiceSid: messagingServiceSid, Body: body })
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(data?.message ?? `Twilio send failed (${res.status})`)
  }
  return { sid: data.sid }
}
