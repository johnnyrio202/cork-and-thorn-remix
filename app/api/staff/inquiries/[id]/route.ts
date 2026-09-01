import { NextResponse } from 'next/server'
import { getStaffUserIdFromRequest } from '@/lib/staff-auth'
import { updateInquiryStatus, type InquiryStatus } from '@/lib/inquiries'

const VALID_STATUSES: InquiryStatus[] = ['new', 'in_progress', 'closed']

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!getStaffUserIdFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await request.json().catch(() => null)
  const status = body?.status

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: `status must be one of ${VALID_STATUSES.join(', ')}` }, { status: 400 })
  }

  const inquiry = await updateInquiryStatus(id, status)
  if (!inquiry) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ inquiry })
}
