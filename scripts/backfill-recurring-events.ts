// One-off backfill — extends the existing weekly show lineup through the end
// of 2026. Most events on the calendar are a recurring weekly (or biweekly)
// slot that just ran out of published rows; this continues each slot's own
// cadence from its last real occurrence instead of hand-entering every week.
// Usage: npx dotenv -e .env.local -- npx tsx scripts/backfill-recurring-events.ts
import { neon } from '@neondatabase/serverless'

const END_DATE = '2026-12-31'

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + days)
  return dt.toISOString().slice(0, 10)
}

function slugify(title: string, date: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${base}-${date}`
}

type EventRow = {
  title: string
  day: string
  time: string
  category: string
  description: string
  price: string
  image_url: string
  artist: string
  capacity: number | null
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set — run this via dotenv -e .env.local')
    process.exit(1)
  }
  const sql = neon(databaseUrl)

  async function latestRow(day: string, time: string, title: string): Promise<{ date: string; row: EventRow }> {
    const rows = (await sql`
      SELECT title, day, time, category, description, price, image_url, artist, capacity, date
      FROM events WHERE day = ${day} AND time = ${time} AND title = ${title}
      ORDER BY date DESC LIMIT 1
    `) as (EventRow & { date: Date })[]
    if (!rows[0]) throw new Error(`No existing row found for ${title} (${day} ${time})`)
    return { date: rows[0].date.toISOString().slice(0, 10), row: rows[0] }
  }

  async function insertOccurrence(row: EventRow, date: string) {
    const slug = slugify(row.title, date)
    await sql`
      INSERT INTO events (title, slug, date, day, time, category, description, price, image_url, artist, capacity, published)
      VALUES (${row.title}, ${slug}, ${date}, ${row.day}, ${row.time}, ${row.category}, ${row.description}, ${row.price}, ${row.image_url}, ${row.artist}, ${row.capacity}, true)
      ON CONFLICT (slug) DO NOTHING
    `
  }

  let total = 0

  // Simple weekly slots — same title every week.
  const weeklySlots: [string, string, string][] = [
    ['Monday', '8:00 PM', 'Martini Mondays'],
    ['Monday', '10:00 PM', 'Industry Underground'],
    ['Tuesday', '8:00 PM', 'Tequila Tuesdays'],
    ['Wednesday', '9:00 PM', 'Karaoke Wednesday Night'],
    ['Friday', '11:00 PM', 'Fresh Fridays'],
    ['Saturday', '11:30 PM', 'Super Dope Saturdays'],
    ['Saturday', '9:00 PM', 'Sultry Saturday'],
  ]
  for (const [day, time, title] of weeklySlots) {
    const { date: lastDate, row } = await latestRow(day, time, title)
    let d = addDays(lastDate, 7)
    while (d <= END_DATE) {
      await insertOccurrence(row, d)
      total++
      d = addDays(d, 7)
    }
    console.log(`${title} (${day} ${time}): filled through ${END_DATE}`)
  }

  // Biweekly slot.
  {
    const { date: lastDate, row } = await latestRow('Friday', '8:00 PM', "Uncork'd Comedy Jam")
    let d = addDays(lastDate, 14)
    while (d <= END_DATE) {
      await insertOccurrence(row, d)
      total++
      d = addDays(d, 14)
    }
    console.log(`Uncork'd Comedy Jam (Friday 8:00 PM, biweekly): filled through ${END_DATE}`)
  }

  // Alternating weekly slots — two shows trading off the same night.
  const alternatingSlots: [string, string, [string, string]][] = [
    ['Thursday', '8:00 PM', ['R&B Thursday', 'Thursday Night Vibes']],
    ['Sunday', '5:00 PM', ['For the Love of R&B', 'Kreme Sunday']],
  ]
  for (const [day, time, [lastRealTitle, otherTitle]] of alternatingSlots) {
    const a = await latestRow(day, time, lastRealTitle)
    const b = await latestRow(day, time, otherTitle)
    // lastRealTitle had the most recent real occurrence, so the next
    // generated date continues the alternation with the other title.
    let d = addDays(a.date, 7)
    let useOther = true
    while (d <= END_DATE) {
      await insertOccurrence(useOther ? b.row : a.row, d)
      total++
      useOther = !useOther
      d = addDays(d, 7)
    }
    console.log(`${lastRealTitle} / ${otherTitle} (${day} ${time}, alternating): filled through ${END_DATE}`)
  }

  console.log(`\nInserted ${total} new event rows.`)
}

main()
