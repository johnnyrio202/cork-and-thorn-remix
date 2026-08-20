import { Resend } from 'resend'
import { tableTiers, RESERVATION_DEPOSIT } from '@/lib/data'

let _resend: Resend | null = null

function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY!)
  }
  return _resend
}

export async function sendReservationDepositReceipt(booking: {
  guest_name: string
  guest_email: string
  tier_id: string
  reservation_date: string
  checkout_session_id: string
}) {
  const tier = tableTiers.find((t) => t.id === booking.tier_id)
  const tierName = tier?.name ?? booking.tier_id
  const amount = RESERVATION_DEPOSIT.amount

  await getResend().emails.send({
    from: 'Cork & Thorn <onboarding@resend.dev>',
    to: booking.guest_email,
    subject: 'Your Cork & Thorn reservation is confirmed',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>You're confirmed, ${booking.guest_name}.</h2>
        <p>Your <strong>${tierName}</strong> reservation for <strong>${booking.reservation_date}</strong> is booked.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px 0; border-top: 1px solid #eee;">Reservation deposit (non-refundable)</td>
            <td style="padding: 8px 0; border-top: 1px solid #eee; text-align: right;">$${amount.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-top: 1px solid #eee; font-weight: bold;">Total charged</td>
            <td style="padding: 8px 0; border-top: 1px solid #eee; text-align: right; font-weight: bold;">$${amount.toFixed(2)}</td>
          </tr>
        </table>
        <p style="color: #888; font-size: 12px;">Confirmation ref: ${booking.checkout_session_id}</p>
      </div>
    `,
  })
}
