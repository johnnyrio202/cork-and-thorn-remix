import { neon } from '@neondatabase/serverless'

// Lazy init — evaluating neon() at module load time would throw at build
// time if DATABASE_URL isn't set yet (e.g. before Marketplace provisioning).
let _sql: ReturnType<typeof neon> | null = null

export function getSql() {
  if (!_sql) {
    _sql = neon(process.env.DATABASE_URL!)
  }
  return _sql
}
