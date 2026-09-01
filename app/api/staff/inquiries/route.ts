import { NextResponse } from 'next/server'
import { getStaffUserIdFromRequest } from '@/lib/staff-auth'
import { listInquiries, type InquiryStatus, type InquiryType } from '@/lib/inquiries'

const VALID_TYPES: InquiryType[] = ['party', 'catering', 'job', 'contact']
const VALID_STATUSES: InquiryStatus[] = ['new', 'in_progress', 'closed']

export async function GET(request: Request) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const typeParam = url.searchParams.get('type')
  const statusParam = url.searchParams.get('status')

  const type = VALID_TYPES.includes(typeParam as InquiryType) ? (typeParam as InquiryType) : undefined
  const status = VALID_STATUSES.includes(statusParam as InquiryStatus) ? (statusParam as InquiryStatus) : undefined

  const inquiries = await listInquiries({ type, status })
  return NextResponse.json({ inquiries })
}
