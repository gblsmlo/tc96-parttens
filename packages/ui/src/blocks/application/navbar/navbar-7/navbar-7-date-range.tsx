'use client'

import type { DateRange, Locale } from '@daypicker/react'
import { ptBR } from '@daypicker/react/locale'
import { CalendarBlankIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Calendar } from '@tc96/ui/calendar'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { type ReactElement, useState } from 'react'
import type { Navbar7Range } from './types'

interface Navbar7DateRangeProps {
  calendarLocale?: Locale
  label: string
  locale: string
  onRangeChange: (range: Navbar7Range) => void
  placeholder: string
  range: Navbar7Range
}

const formatRange = (range: Navbar7Range, locale: string): string | null => {
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' })
  if (range.from && range.to) return formatter.formatRange(range.from, range.to)
  if (range.from) return formatter.format(range.from)
  return null
}

export function Navbar7DateRange({
  calendarLocale = ptBR,
  label,
  locale,
  onRangeChange,
  placeholder,
  range,
}: Readonly<Navbar7DateRangeProps>): ReactElement {
  const [open, setOpen] = useState(false)
  const text = formatRange(range, locale)

  const select = (next: DateRange | undefined) => {
    const value = { from: next?.from, to: next?.to }
    onRangeChange(value)
    if (value.from && value.to && value.from.getTime() !== value.to.getTime()) {
      setOpen(false)
    }
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger render={<Button size="sm" variant="outline" />}>
        <CalendarBlankIcon aria-hidden="true" />
        <span className={text ? undefined : 'text-muted-foreground'}>
          {text ?? placeholder}
        </span>
      </PopoverTrigger>
      <PopoverPopup align="start" aria-label={label}>
        <Calendar
          defaultMonth={range.from}
          locale={calendarLocale}
          mode="range"
          numberOfMonths={2}
          onSelect={select}
          selected={{ from: range.from, to: range.to }}
        />
      </PopoverPopup>
    </Popover>
  )
}
