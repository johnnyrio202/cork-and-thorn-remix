import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])
const MAX_BYTES = 5 * 1024 * 1024

// Public — job applicants aren't staff, unlike
// app/api/staff/content/upload/route.ts which this otherwise mirrors.
// Restricted to resume-shaped files/sizes since anyone can call it.
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Only PDF or Word documents are accepted' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File must be under 5MB' }, { status: 400 })
  }

  const blob = await put(`resumes/${Date.now()}-${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  return NextResponse.json({ url: blob.url })
}
