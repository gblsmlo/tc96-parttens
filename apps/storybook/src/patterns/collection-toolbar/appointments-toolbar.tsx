import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Action,
  addCalendarDays,
  type CalendarDate,
  type CalendarViewMode,
  CollectionToolbar,
  calendarRange,
  toZonedDateTime,
} from '@tc96/ui/patterns'
import { Text } from '@tc96/ui/text'
import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import { ToolbarButton } from '@tc96/ui/toolbar'
import { useState } from 'react'

const LOCALE = 'pt-BR'
const TIME_ZONE = 'America/Sao_Paulo'
const WEEK_STARTS_ON = 1

const rangeModes: readonly { label: string; value: CalendarViewMode }[] = [
  { label: 'Dia', value: 'day' },
  { label: 'Semana', value: 'week' },
  { label: 'Mês', value: 'month' },
]

const isRangeMode = (value: string): value is CalendarViewMode =>
  rangeModes.some((mode) => mode.value === value)

const monthShort = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  timeZone: 'UTC',
})
const monthYear = new Intl.DateTimeFormat(LOCALE, {
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
})

const asUtcDate = (date: CalendarDate) =>
  new Date(Date.UTC(date.year, date.month - 1, date.day))

const shiftDate = (
  date: CalendarDate,
  mode: CalendarViewMode,
  step: -1 | 1,
): CalendarDate => {
  if (mode === 'day') return addCalendarDays(date, step)
  if (mode === 'week') return addCalendarDays(date, step * 7)
  return addCalendarDays({ ...date, day: 1, month: date.month + step }, 0)
}

export const appointmentToday = (): CalendarDate =>
  toZonedDateTime(new Date(), TIME_ZONE).date

export const formatAppointmentPeriod = (
  date: CalendarDate,
  mode: CalendarViewMode,
) => {
  if (mode === 'day') {
    return `${date.day} de ${monthShort.format(asUtcDate(date))}`
  }
  if (mode === 'month') return monthYear.format(asUtcDate(date))
  const range = calendarRange(date, 'week', WEEK_STARTS_ON)
  const first = range[0] ?? date
  const last = range[range.length - 1] ?? date
  const lastMonth = monthShort.format(asUtcDate(last))
  if (first.month === last.month && first.year === last.year) {
    return `${first.day} – ${last.day} de ${lastMonth}`
  }
  const firstMonth = monthShort.format(asUtcDate(first))
  if (first.year === last.year) {
    return `${first.day} de ${firstMonth} – ${last.day} de ${lastMonth}`
  }
  return `${first.day} de ${firstMonth} de ${first.year} – ${last.day} de ${lastMonth} de ${last.year}`
}

const ignore = () => undefined

export function AppointmentsToolbar() {
  const [anchor, setAnchor] = useState(appointmentToday)
  const [mode, setMode] = useState<CalendarViewMode>('week')

  return (
    <CollectionToolbar
      aria-label="Controles da agenda"
      center={
        <ToggleGroup
          aria-label="Período"
          onValueChange={(next) => {
            const [value] = next as string[]
            if (value && isRangeMode(value)) setMode(value)
          }}
          value={[mode]}
        >
          {rangeModes.map((option) => (
            <ToggleGroupItem
              key={option.value}
              render={
                <Button
                  size="sm"
                  variant={option.value === mode ? 'secondary' : 'ghost'}
                />
              }
              value={option.value}
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      }
      left={
        <div className="flex min-w-0 items-center gap-2">
          <ToolbarButton
            onClick={() => setAnchor(appointmentToday())}
            render={<Button variant="secondary" />}
          >
            Hoje
          </ToolbarButton>
          <ToolbarButton
            aria-label="Período anterior"
            onClick={() => setAnchor(shiftDate(anchor, mode, -1))}
            render={<Button size="icon-sm" variant="ghost" />}
          >
            <CaretLeftIcon aria-hidden="true" />
          </ToolbarButton>
          <ToolbarButton
            aria-label="Próximo período"
            onClick={() => setAnchor(shiftDate(anchor, mode, 1))}
            render={<Button size="icon-sm" variant="ghost" />}
          >
            <CaretRightIcon aria-hidden="true" />
          </ToolbarButton>
          <Text
            aria-live="polite"
            className="min-w-0 first-letter:uppercase"
            render={<p />}
            size="sm"
            truncate
            weight="medium"
          >
            {formatAppointmentPeriod(anchor, mode)}
          </Text>
        </div>
      }
      right={<Action label="Novo compromisso" onClick={ignore} />}
    />
  )
}
