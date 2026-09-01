import { getSql } from '@/lib/db'

export type InquiryType = 'party' | 'catering' | 'job' | 'contact'
export type InquiryStatus = 'new' | 'in_progress' | 'closed'

export type Inquiry = {
  id: string
  type: InquiryType
  status: InquiryStatus
  name: string
  email: string
  phone: string | null
  details: Record<string, unknown>
  created_at: string
  updated_at: string
}

export async function createInquiry(input: {
  type: InquiryType
  name: string
  email: string
  phone?: string | null
  details: Record<string, unknown>
}): Promise<Inquiry> {
  const sql = getSql()
  const rows = (await sql`
    INSERT INTO inquiries (type, name, email, phone, details)
    VALUES (${input.type}, ${input.name}, ${input.email}, ${input.phone ?? null}, ${JSON.stringify(input.details)}::jsonb)
    RETURNING *
  `) as Inquiry[]
  return rows[0]
}

export async function listInquiries(filter: {
  type?: InquiryType
  status?: InquiryStatus
}): Promise<Inquiry[]> {
  const sql = getSql()
  return (await sql`
    SELECT * FROM inquiries
    WHERE (${filter.type ?? null}::text IS NULL OR type = ${filter.type ?? null})
      AND (${filter.status ?? null}::text IS NULL OR status = ${filter.status ?? null})
    ORDER BY created_at DESC
  `) as Inquiry[]
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<Inquiry | null> {
  const sql = getSql()
  const rows = (await sql`
    UPDATE inquiries SET status = ${status}, updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `) as Inquiry[]
  return rows[0] ?? null
}
