'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ReservationDatePicker } from '@/components/reservations/date-picker'
import { SpatialBooking, type AvailabilityMap, type BoothOccupant } from '@/components/spatial-booking'
import { StaffNav } from '@/components/staff/staff-nav'
import { BOOTHS } from '@/lib/data'

type Booking = {
  id: string
  booth_id: string
  tier_id: string
  reservation_date: string
  arrival_time: string
  party_size: number
  guest_name: string
  guest_phone: string
  guest_email: string
  promoter_code: string | null
  deposit_amount_cents: number | null
  notes: string | null
  status: string
  created_at: string
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function StaffDashboard() {
  const router = useRouter()
  const [date, setDate] = useState(todayISO())
  const [availability, setAvailability] = useState<AvailabilityMap>({})
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [availRes, bookingsRes] = await Promise.all([
        fetch(`/api/availability?date=${date}`),
        fetch(`/api/staff/bookings?date=${date}`),
      ])
      if (bookingsRes.status === 401) {
        router.push('/staff/login')
        return
      }
      setAvailability(await availRes.json())
      const data = await bookingsRes.json()
      setBookings(data.bookings ?? [])
    } catch {
      setError('Failed to load bookings')
    } finally {
      setIsLoading(false)
    }
  }, [date, router])

  useEffect(() => {
    load()
  }, [load])

  async function handleLogout() {
    await fetch('/api/staff/logout', { method: 'POST' })
    router.push('/staff/login')
  }

  async function handleAction(id: string, action: 'cancel' | 'no-show') {
    await fetch(`/api/staff/bookings/${id}/${action}`, { method: 'POST' })
    load()
  }

  function handleCancelBooth(boothId: string) {
    const booking = bookings.find((b) => b.booth_id === boothId && (b.status === 'confirmed' || b.status === 'pending_deposit'))
    if (booking) handleAction(booking.id, 'cancel')
  }

  function handleNoShowBooth(boothId: string) {
    const booking = bookings.find((b) => b.booth_id === boothId && (b.status === 'confirmed' || b.status === 'pending_deposit'))
    if (booking) handleAction(booking.id, 'no-show')
  }

  const occupants: Record<string, BoothOccupant> = {}
  for (const b of bookings) {
    if (b.status === 'confirmed' || b.status === 'pending_deposit') {
      occupants[b.booth_id] = { guest_name: b.guest_name, arrival_time: b.arrival_time, status: b.status }
    }
  }

  const activeBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending_deposit')

  return (
    <div className="min-h-screen bg-[#0B111B] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="font-heading text-3xl tracking-wide text-foreground">Staff Dashboard</h1>
          <StaffNav />
        </div>
        <Button variant="ghost" onClick={handleLogout}>Sign out</Button>
      </div>

      <div className="mx-auto mt-6 max-w-xs">
        <ReservationDatePicker value={date} onChange={setDate} disablePastDates={false} />
      </div>

      {error && <p className="mx-auto mt-4 max-w-7xl text-sm text-destructive">{error}</p>}
      {isLoading && <p className="mx-auto mt-4 max-w-7xl text-sm text-muted-foreground">Loading…</p>}

      <div className="mx-auto max-w-7xl">
        <SpatialBooking
          date={date}
          availability={availability}
          mode="staff"
          occupants={occupants}
          onCancelBooth={handleCancelBooth}
          onNoShowBooth={handleNoShowBooth}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-10">
        <h2 className="font-heading text-2xl tracking-wide text-foreground mb-4">
          Bookings for {date} ({activeBookings.length})
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-white/50">
              <tr>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Table</th>
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">Party</th>
                <th className="px-4 py-3 font-medium">Notes</th>
                <th className="px-4 py-3 font-medium">Promoter</th>
                <th className="px-4 py-3 font-medium">Deposit</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.map((b) => {
                const booth = BOOTHS.find((bo) => bo.id === b.booth_id)
                const active = b.status === 'confirmed' || b.status === 'pending_deposit'
                return (
                  <tr key={b.id} className="text-white/80">
                    <td className="px-4 py-3">{b.arrival_time}</td>
                    <td className="px-4 py-3">{booth?.name ?? b.booth_id}</td>
                    <td className="px-4 py-3">
                      <div>{b.guest_name}</div>
                      <div className="text-xs text-white/40">{b.guest_phone}</div>
                    </td>
                    <td className="px-4 py-3">{b.party_size}</td>
                    <td className="px-4 py-3 max-w-[180px] truncate" title={b.notes ?? undefined}>
                      {b.notes ?? '—'}
                    </td>
                    <td className="px-4 py-3">{b.promoter_code ?? '—'}</td>
                    <td className="px-4 py-3">
                      {b.deposit_amount_cents ? `$${(b.deposit_amount_cents / 100).toFixed(2)}` : '—'}
                    </td>
                    <td className="px-4 py-3 capitalize">{b.status.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      {active && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(b.id, 'cancel')}
                            className="text-xs text-white/60 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAction(b.id, 'no-show')}
                            className="text-xs text-destructive hover:text-destructive/80"
                          >
                            No-show
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
              {bookings.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-white/40">
                    No bookings for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
