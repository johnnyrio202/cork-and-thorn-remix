'use client'

import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Check, Wine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ReservationDatePicker } from './date-picker'
import { ReservationForm } from './reservation-form'
import { SpatialBooking, type AvailabilityMap } from '@/components/spatial-booking'
import {
  ARRIVAL_TIME_OPTIONS,
  tableTiers,
  bottleService,
  isNightlifeSlot,
  NIGHTLIFE_SLOT,
  type Booth,
} from '@/lib/data'
import { cn } from '@/lib/utils'

interface BookingWizardProps {
  prefillDate?: string
  prefillTime?: string
}

function StepCard({
  step,
  title,
  isDone,
  summary,
  onChangeClick,
  children,
}: {
  step: number
  title: string
  isDone: boolean
  summary?: string
  onChangeClick?: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
              isDone ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground',
            )}
          >
            {isDone ? <Check className="h-3.5 w-3.5" /> : step}
          </span>
          <div>
            <h3 className="font-heading text-lg tracking-wide">{title}</h3>
            {isDone && summary && <p className="text-sm text-primary">{summary}</p>}
          </div>
        </div>
        {isDone && onChangeClick && (
          <button
            type="button"
            onClick={onChangeClick}
            className="text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-2"
          >
            Change
          </button>
        )}
      </div>
      {!isDone && <div className="border-t border-border px-5 py-5">{children}</div>}
    </div>
  )
}

export function BookingWizard({ prefillDate, prefillTime }: BookingWizardProps) {
  const [date, setDate] = useState(prefillDate ?? '')
  const [time, setTime] = useState(prefillTime ?? '')
  const [guests, setGuests] = useState('4')
  const [booth, setBooth] = useState<Booth | null>(null)
  const [bottles, setBottles] = useState<string[]>([])
  const [availability, setAvailability] = useState<AvailabilityMap>({})
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (prefillDate) setDate(prefillDate)
    if (prefillTime) setTime(prefillTime)
  }, [prefillDate, prefillTime])

  useEffect(() => {
    if (!date || !time) {
      setAvailability({})
      return
    }
    let cancelled = false
    fetch(`/api/availability?date=${date}&time=${encodeURIComponent(time)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setAvailability(data)
      })
    return () => {
      cancelled = true
    }
  }, [date, time])

  function handleDateChange(next: string) {
    setDate(next)
    setTime('')
    setBooth(null)
  }

  function handleTimeChange(next: string) {
    setTime(next)
    setBooth(null)
  }

  function handleSelectBooth(b: Booth) {
    setBooth(b)
  }

  function toggleBottle(name: string) {
    setBottles((prev) => (prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]))
  }

  function handleBookingComplete() {
    setDialogOpen(false)
    setDate('')
    setTime('')
    setBooth(null)
    setBottles([])
  }

  const nightlife = isNightlifeSlot(date, time)
  const tier = booth ? tableTiers.find((t) => t.id === booth.tier) : null
  const dateSummary = date ? format(parseISO(date), 'EEE, MMM d, yyyy') : ''
  const timeSummary = time ? `${time} · ${guests} ${Number(guests) === 1 ? 'guest' : 'guests'}` : ''

  return (
    <div id="booking-wizard" className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <p className="font-sans text-[9px] uppercase tracking-[0.5em] text-primary/50 mb-1">
          Secure Your Seat
        </p>
        <h2 className="font-sans text-2xl md:text-3xl font-bold text-white">Reserve Your Night</h2>
      </div>

      <div className="flex flex-col gap-4">
        <StepCard
          step={1}
          title="Date"
          isDone={!!date}
          summary={dateSummary}
          onChangeClick={() => handleDateChange('')}
        >
          <ReservationDatePicker value={date} onChange={handleDateChange} />
        </StepCard>

        {date && (
          <StepCard
            step={2}
            title="Time & Party"
            isDone={!!time}
            summary={timeSummary}
            onChangeClick={() => handleTimeChange('')}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm text-muted-foreground">Arrival time</p>
                <div className="flex flex-wrap gap-2">
                  {ARRIVAL_TIME_OPTIONS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTimeChange(t)}
                      className={cn(
                        'rounded-full border px-4 py-2 text-sm transition-colors',
                        time === t
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background hover:border-primary/50',
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm text-muted-foreground">Guests</p>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? 'guest' : 'guests'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </StepCard>
        )}

        {date && time && (
          <StepCard
            step={3}
            title="Table"
            isDone={!!booth}
            summary={booth?.name}
            onChangeClick={() => setBooth(null)}
          >
            <SpatialBooking
              date={date}
              availability={availability}
              selectedBoothId={booth?.id}
              onSelectBooth={handleSelectBooth}
            />
          </StepCard>
        )}

        {booth && tier && (
          <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                <Check className="h-3.5 w-3.5" />
              </span>
              <h3 className="font-heading text-lg tracking-wide">Your Package</h3>
            </div>
            <p className="font-heading text-2xl">
              ${tier.minSpend}
              <span className="text-sm font-normal text-muted-foreground"> minimum spend</span>
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {tier.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Check className="h-3 w-3 shrink-0 text-primary" />
                  {perk}
                </li>
              ))}
            </ul>

            <p className="mt-5 mb-2 text-sm text-muted-foreground">
              Bottle service (optional — arranged with your host, not charged online)
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {bottleService.map((b) => {
                const active = bottles.includes(b.name)
                return (
                  <button
                    type="button"
                    key={b.name}
                    onClick={() => toggleBottle(b.name)}
                    className={cn(
                      'flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition-colors',
                      active
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background hover:border-primary/50',
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Wine className={cn('h-3.5 w-3.5', active ? 'text-primary' : 'text-muted-foreground')} />
                      {b.name}
                    </span>
                    <span className="font-heading">${b.price}</span>
                  </button>
                )
              })}
            </div>

            <Button
              size="lg"
              onClick={() => setDialogOpen(true)}
              className="mt-6 w-full shadow-glow-primary"
            >
              {nightlife ? `Reserve & Pay $${NIGHTLIFE_SLOT.depositAmount} Deposit` : 'Reserve Table'}
            </Button>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Complete Your Reservation</DialogTitle>
          </DialogHeader>
          {booth && (
            <ReservationForm
              date={date}
              time={time}
              booth={booth}
              partySize={Number(guests)}
              bottles={bottles}
              onBookingComplete={handleBookingComplete}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
