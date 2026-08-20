'use client'

import { format, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DatePickerProps {
  value: string // yyyy-MM-dd, or '' for unset
  onChange: (value: string) => void
  disablePastDates?: boolean
}

export function ReservationDatePicker({ value, onChange, disablePastDates = true }: DatePickerProps) {
  const selected = value ? parseISO(value) : undefined

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="lg"
            className="w-full justify-start gap-3 border-primary/30 bg-card py-6 text-left font-heading text-lg tracking-wide hover:border-primary/60"
          />
        }
      >
        <CalendarIcon className="h-5 w-5 text-primary" />
        {selected ? format(selected, 'dd/MM/yyyy') : 'Select a date'}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => onChange(date ? format(date, 'yyyy-MM-dd') : '')}
          disabled={disablePastDates ? { before: new Date() } : undefined}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
