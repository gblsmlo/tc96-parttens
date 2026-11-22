import { ptBR } from '@daypicker/react/locale'
import {
  type DateRange,
  DateRangeProperty,
  type DateRangePropertyProps,
} from '@tc96/parttens'
import { useState } from 'react'
import type { DateRangeControls } from './date-range-controls.ts'

export const sampleFrom = new Date(2026, 5, 19)
export const sampleTo = new Date(2026, 5, 26)

const valueOfEnds: Record<DateRangeControls['ends'], DateRange | undefined> = {
  both: { from: sampleFrom, to: sampleTo },
  from: { from: sampleFrom, to: undefined },
  none: undefined,
  until: { from: undefined, to: sampleTo },
}

export type StatefulDateRangeProps = Omit<
  DateRangePropertyProps,
  'onValueChange'
>

export function StatefulDateRange({
  value: initialValue,
  ...props
}: Readonly<StatefulDateRangeProps>) {
  const [value, setValue] = useState(initialValue)

  return <DateRangeProperty {...props} onValueChange={setValue} value={value} />
}

export const ComposedDateRange = ({
  calendarLocale,
  displayLabel,
  ends,
  ...props
}: Readonly<DateRangeControls>) => (
  <StatefulDateRange
    {...props}
    calendarLocale={calendarLocale === 'ptBR' ? ptBR : undefined}
    displayLabel={displayLabel || undefined}
    key={ends}
    value={valueOfEnds[ends]}
  />
)
