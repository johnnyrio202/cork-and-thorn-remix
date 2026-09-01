import { getSql } from '@/lib/db'

export type Subscriber = {
  id: string
  email: string | null
  phone: string | null
  name: string | null
  email_opt_in: boolean
  sms_opt_in: boolean
  source: string
  unsubscribed_email_at: string | null
  unsubscribed_sms_at: string | null
  resend_contact_id: string | null
  created_at: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, '')
  if (digits.length < 10) return null
  if (digits.startsWith('+')) return digits
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return digits
}

export async function listSubscribers(limit = 200, offset = 0): Promise<{ rows: Subscriber[]; total: number }> {
  const sql = getSql()
  const rows = (await sql`
    SELECT * FROM subscribers ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
  `) as Subscriber[]
  const countRows = (await sql`SELECT count(*)::int AS count FROM subscribers`) as { count: number }[]
  return { rows, total: countRows[0]?.count ?? 0 }
}

export async function subscriberCounts(): Promise<{ email: number; sms: number; total: number }> {
  const sql = getSql()
  // count(*)::int — without the cast, Postgres returns bigint, which
  // this driver hands back as a string, not a number (same issue fixed
  // in lib/orders.ts's ticketsSoldOrHeld — found there by a real test
  // that broke on it; fixing it here proactively since it's the same
  // pattern).
  const rows = (await sql`
    SELECT
      count(*) FILTER (WHERE email IS NOT NULL AND email_opt_in)::int AS email,
      count(*) FILTER (WHERE phone IS NOT NULL AND sms_opt_in)::int AS sms,
      count(*)::int AS total
    FROM subscribers
  `) as { email: number; sms: number; total: number }[]
  return rows[0] ?? { email: 0, sms: 0, total: 0 }
}

export async function addSubscriber(input: {
  email?: string | null
  phone?: string | null
  name?: string | null
  source?: string
}): Promise<Subscriber | null> {
  const email = input.email?.trim().toLowerCase() || null
  const phone = input.phone ? normalizePhone(input.phone) : null
  if (!email && !phone) return null

  const sql = getSql()

  // Two separate unique columns (email, phone) means a single ON CONFLICT
  // target can't cover both — a phone-only row could collide with an
  // existing phone even though there's no email conflict. Look up first
  // instead of relying on the DB to pick the right conflict target.
  const existing = (await sql`
    SELECT * FROM subscribers
    WHERE (${email}::text IS NOT NULL AND email = ${email})
       OR (${phone}::text IS NOT NULL AND phone = ${phone})
    LIMIT 1
  `) as Subscriber[]

  if (existing[0]) {
    const rows = (await sql`
      UPDATE subscribers SET
        email = COALESCE(subscribers.email, ${email}),
        phone = COALESCE(subscribers.phone, ${phone}),
        name = COALESCE(subscribers.name, ${input.name ?? null})
      WHERE id = ${existing[0].id}
      RETURNING *
    `) as Subscriber[]
    return rows[0] ?? null
  }

  const rows = (await sql`
    INSERT INTO subscribers (email, phone, name, source)
    VALUES (${email}, ${phone}, ${input.name ?? null}, ${input.source ?? 'manual'})
    RETURNING *
  `) as Subscriber[]
  return rows[0] ?? null
}

export async function setOptIn(id: string, channel: 'email' | 'sms', optedIn: boolean): Promise<void> {
  const sql = getSql()
  if (channel === 'email') {
    await sql`
      UPDATE subscribers SET email_opt_in = ${optedIn},
        unsubscribed_email_at = CASE WHEN ${optedIn} THEN NULL ELSE now() END
      WHERE id = ${id}
    `
  } else {
    await sql`
      UPDATE subscribers SET sms_opt_in = ${optedIn},
        unsubscribed_sms_at = CASE WHEN ${optedIn} THEN NULL ELSE now() END
      WHERE id = ${id}
    `
  }
}

export async function setSmsOptInByPhone(phone: string, optedIn: boolean): Promise<void> {
  const normalized = normalizePhone(phone)
  if (!normalized) return
  const sql = getSql()
  await sql`
    UPDATE subscribers SET sms_opt_in = ${optedIn},
      unsubscribed_sms_at = CASE WHEN ${optedIn} THEN NULL ELSE now() END
    WHERE phone = ${normalized}
  `
}

export type ImportResult = { imported: number; skipped: number; total: number }

// Lenient CSV/line parser: works with a header row that has an
// email/phone-ish column name, or with one bare email/phone per line —
// the real SpotHopper export format isn't in hand yet, so this avoids
// hard-coding a column layout that turns out to be wrong.
export async function importSubscribersFromCsv(
  csvText: string,
  channel: 'email' | 'sms',
  source: string,
): Promise<ImportResult> {
  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return { imported: 0, skipped: 0, total: 0 }

  const splitRow = (line: string) => line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''))

  const firstRow = splitRow(lines[0])
  const looksLikeHeader = firstRow.some((c) => /email|phone|mobile|cell|name/i.test(c))
  const header = looksLikeHeader ? firstRow.map((c) => c.toLowerCase()) : null
  const dataLines = looksLikeHeader ? lines.slice(1) : lines

  const emailCol = header?.findIndex((c) => c.includes('email')) ?? -1
  const phoneCol = header?.findIndex((c) => c.includes('phone') || c.includes('mobile') || c.includes('cell')) ?? -1
  const nameCol = header?.findIndex((c) => c.includes('name')) ?? -1

  let imported = 0
  let skipped = 0

  for (const line of dataLines) {
    const cols = splitRow(line)
    let email: string | null = null
    let phone: string | null = null
    let name: string | null = null

    if (header) {
      email = emailCol >= 0 ? cols[emailCol] : null
      phone = phoneCol >= 0 ? cols[phoneCol] : null
      name = nameCol >= 0 ? cols[nameCol] : null
    } else {
      const raw = cols[0]
      if (channel === 'email') email = raw
      else phone = raw
    }

    if (channel === 'email' && email && !EMAIL_RE.test(email)) email = null
    if (channel === 'sms' && phone) phone = normalizePhone(phone)

    const result = await addSubscriber({ email, phone, name, source })
    if (result) imported++
    else skipped++
  }

  return { imported, skipped, total: dataLines.length }
}
