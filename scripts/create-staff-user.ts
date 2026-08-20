// One-off script to create a staff account — there's no self-serve signup.
// Usage: npx dotenv -e .env.local -- npx tsx scripts/create-staff-user.ts "Name" "email@example.com" "password"
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

async function main() {
  const [name, email, password] = process.argv.slice(2)
  if (!name || !email || !password) {
    console.error('Usage: tsx scripts/create-staff-user.ts "Name" "email@example.com" "password"')
    process.exit(1)
  }

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set — run this via dotenv -e .env.local')
    process.exit(1)
  }

  const sql = neon(databaseUrl)
  const passwordHash = await bcrypt.hash(password, 12)

  const rows = await sql`
    INSERT INTO staff_users (name, email, password_hash)
    VALUES (${name}, ${email.toLowerCase().trim()}, ${passwordHash})
    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name
    RETURNING id, name, email
  `

  console.log('Staff user ready:', rows[0])
}

main()
