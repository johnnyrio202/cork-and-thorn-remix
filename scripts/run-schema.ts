// Applies scripts/schema.sql against DATABASE_URL. Every statement in that
// file is idempotent (CREATE TABLE/INDEX IF NOT EXISTS), so this is safe to
// re-run.
// Usage: npx dotenv -e .env.local -- npx tsx scripts/run-schema.ts
import fs from 'node:fs'
import path from 'node:path'
import { neon } from '@neondatabase/serverless'

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set — run this via dotenv -e .env.local')
    process.exit(1)
  }

  const sql = neon(databaseUrl)
  const filePath = path.join(process.cwd(), 'scripts', 'schema.sql')
  const raw = fs.readFileSync(filePath, 'utf8')

  const statements = raw
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)

  for (const statement of statements) {
    console.log('Running:', statement.split('\n')[0].slice(0, 60), '…')
    await sql.query(statement)
  }

  console.log(`Applied ${statements.length} statements.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
