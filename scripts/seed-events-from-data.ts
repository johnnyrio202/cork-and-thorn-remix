// One-time backfill: copies the hardcoded events from lib/data.ts into the
// new `events` table so the admin panel starts with real data. Safe to
// re-run — inserts are keyed on the same deterministic slug and upsert.
// Usage: npx dotenv -e .env.local -- npx tsx scripts/seed-events-from-data.ts
import { neon } from '@neondatabase/serverless'
import { events } from '../lib/data'
import { slugify } from '../lib/content-data'

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set — run this via dotenv -e .env.local')
    process.exit(1)
  }

  const sql = neon(databaseUrl)
  let count = 0

  for (const event of events) {
    const slug = slugify(event.title, event.date)
    await sql`
      INSERT INTO events (title, slug, date, day, time, category, description, price, image_url, artist, published)
      VALUES (${event.title}, ${slug}, ${event.date}, ${event.day}, ${event.time}, ${event.category},
              ${event.description}, ${event.price}, ${event.image}, ${event.artist}, true)
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        date = EXCLUDED.date,
        day = EXCLUDED.day,
        time = EXCLUDED.time,
        category = EXCLUDED.category,
        description = EXCLUDED.description,
        price = EXCLUDED.price,
        image_url = EXCLUDED.image_url,
        artist = EXCLUDED.artist,
        updated_at = now()
    `
    count++
  }

  console.log(`Seeded ${count} events.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
