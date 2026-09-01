import { NextResponse } from 'next/server'
import { createInquiry, type InquiryType } from '@/lib/inquiries'
import { notifyStaffInquiry, sendInquiryConfirmation } from '@/lib/email'

const VALID_TYPES: InquiryType[] = ['party', 'catering', 'job', 'contact']

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const type = body?.type

  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: `type must be one of ${VALID_TYPES.join(', ')}` }, { status: 400 })
  }
  if (!isNonEmptyString(body?.name) || !isNonEmptyString(body?.email)) {
    return NextResponse.json({ error: 'name and email are required' }, { status: 400 })
  }

  const details = body?.details && typeof body.details === 'object' ? body.details : {}
  const phone = isNonEmptyString(body?.phone) ? body.phone : null

  // Type-specific required fields — kept here rather than per-form, since
  // this is the one place that has to actually trust the data.
  if (type === 'party' && (!isNonEmptyString(details.eventType) || !isNonEmptyString(details.guestCount))) {
    return NextResponse.json({ error: 'eventType and guestCount are required for party inquiries' }, { status: 400 })
  }
  if (type === 'catering' && (!isNonEmptyString(details.eventDate) || !isNonEmptyString(details.guestCount))) {
    return NextResponse.json({ error: 'eventDate and guestCount are required for catering inquiries' }, { status: 400 })
  }
  if (type === 'job' && !isNonEmptyString(details.position)) {
    return NextResponse.json({ error: 'position is required for job applications' }, { status: 400 })
  }
  if (type === 'contact' && !isNonEmptyString(details.message)) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 })
  }

  const inquiry = await createInquiry({ type, name: body.name, email: body.email, phone, details })

  try {
    await sendInquiryConfirmation(type, body.name, body.email)
    await notifyStaffInquiry(type, body.name, body.email, phone)
  } catch (err) {
    console.error('Failed to send inquiry emails:', err)
  }

  return NextResponse.json({ inquiry }, { status: 201 })
}
