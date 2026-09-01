import { Resend } from 'resend'
import { tableTiers, BOOTHS } from '@/lib/data'
import type { InquiryType } from '@/lib/inquiries'

let _resend: Resend | null = null

function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY!)
  }
  return _resend
}

export async function sendBookingConfirmation(booking: {
  guest_name: string
  guest_email: string
  tier_id: string
  booth_id: string
  reservation_date: string
  arrival_time: string
  notes?: string | null
  deposit_amount_cents: number | null
  checkout_session_id: string | null
}) {
  const tier = tableTiers.find((t) => t.id === booking.tier_id)
  const tierName = tier?.name ?? booking.tier_id
  const boothName = BOOTHS.find((b) => b.id === booking.booth_id)?.name ?? booking.booth_id
  const depositAmount = booking.deposit_amount_cents
    ? booking.deposit_amount_cents / 100
    : null

  const depositRows = depositAmount
    ? `
        <tr>
          <td style="padding: 8px 0; border-top: 1px solid #eee;">Reservation deposit</td>
          <td style="padding: 8px 0; border-top: 1px solid #eee; text-align: right;">$${depositAmount.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-top: 1px solid #eee; font-weight: bold;">Total charged</td>
          <td style="padding: 8px 0; border-top: 1px solid #eee; text-align: right; font-weight: bold;">$${depositAmount.toFixed(2)}</td>
        </tr>
      `
    : ''

  const depositNote = depositAmount
    ? `<p style="color: #888; font-size: 13px;">This deposit is non-refundable if you don't show, and will be applied to your table's spend the night of your reservation.</p>`
    : ''

  const notesRow = booking.notes
    ? `<p style="margin: 12px 0; padding: 10px 12px; background: #f7f4ea; border-radius: 6px; font-size: 14px;"><strong>Your note:</strong> ${booking.notes}</p>`
    : ''

  const refLine = booking.checkout_session_id
    ? `<p style="color: #888; font-size: 12px;">Confirmation ref: ${booking.checkout_session_id}</p>`
    : ''

  await getResend().emails.send({
    from: 'Cork & Thorn <onboarding@resend.dev>',
    to: booking.guest_email,
    subject: 'Your Cork & Thorn reservation is confirmed',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>You're confirmed, ${booking.guest_name}.</h2>
        <p>Your <strong>${boothName}</strong> (${tierName}) reservation for <strong>${booking.reservation_date}</strong> at <strong>${booking.arrival_time}</strong> is booked.</p>
        ${notesRow}
        ${depositRows ? `<table style="width: 100%; border-collapse: collapse; margin: 16px 0;">${depositRows}</table>` : ''}
        ${depositNote}
        ${refLine}
      </div>
    `,
  })
}

const INQUIRY_LABELS: Record<InquiryType, string> = {
  party: 'private party inquiry',
  catering: 'catering inquiry',
  job: 'job application',
  contact: 'message',
}

export async function sendInquiryConfirmation(type: InquiryType, name: string, email: string): Promise<void> {
  const label = INQUIRY_LABELS[type]
  await getResend().emails.send({
    from: 'Cork & Thorn <onboarding@resend.dev>',
    to: email,
    subject: `We received your ${label}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Thanks, ${name}.</h2>
        <p>We received your ${label} and our team will follow up soon.</p>
      </div>
    `,
  })
}

// Optional — degrades to a no-op when unset, same pattern as
// lib/sms.ts's isSmsConfigured(). Nothing sets STAFF_NOTIFICATION_EMAIL
// by default, so staff currently rely on checking /staff/inquiries
// directly until someone opts into this.
export async function notifyStaffInquiry(
  type: InquiryType,
  name: string,
  email: string,
  phone: string | null,
): Promise<void> {
  const staffEmail = process.env.STAFF_NOTIFICATION_EMAIL
  if (!staffEmail) return

  await getResend().emails.send({
    from: 'Cork & Thorn <onboarding@resend.dev>',
    to: staffEmail,
    subject: `New ${INQUIRY_LABELS[type]}: ${name}`,
    html: `<p>${name} (${email}${phone ? `, ${phone}` : ''}) submitted a new ${INQUIRY_LABELS[type]}. Check <a href="https://cork-and-thorn-remix.vercel.app/staff/inquiries">/staff/inquiries</a>.</p>`,
  })
}
