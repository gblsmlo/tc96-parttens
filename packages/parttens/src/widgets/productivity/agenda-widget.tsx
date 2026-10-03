'use client'

import { calendarDateKey } from '@tc96/helpers/calendar-date'
import { Calendar } from '@tc96/ui/calendar'
import { CardPanel } from '@tc96/ui/card'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId, useState } from 'react'
import { CardWidgetShell } from '../shared/card-widget-shell'
import {
  ExpandableList,
  type WidgetExpandProps,
} from '../shared/expandable-list'
import { WidgetHeader } from '../shared/widget-header'

export interface AgendaEvent {
  color?: string
  date: string
  endLabel?: ReactNode
  id: string
  startLabel?: ReactNode
  title: ReactNode
}

export interface AgendaWidgetProps
  extends Omit<ComponentProps<'div'>, 'children' | 'onSelect' | 'title'> {
  action?: ReactNode
  calendarProps?: Omit<
    ComponentProps<typeof Calendar>,
    'mode' | 'modifiers' | 'modifiersClassNames' | 'onSelect' | 'selected'
  >
  defaultSelected?: Date
  emptyLabel?: ReactNode
  expand?: WidgetExpandProps
  events: readonly AgendaEvent[]
  listLabel?: string
  onSelect?: (date: Date) => void
  selected?: Date
  title: ReactNode
}

function dayKeyOf(date: Date): string {
  return calendarDateKey({
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  })
}

function dateOfKey(key: string): Date {
  const [year = 0, month = 1, day = 1] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function AgendaWidget({
  action,
  calendarProps,
  className,
  defaultSelected = new Date(),
  emptyLabel = 'Sem eventos',
  expand,
  events,
  listLabel = 'Eventos do dia',
  onSelect,
  selected,
  title,
  ...props
}: Readonly<AgendaWidgetProps>): ReactElement {
  const titleId = useId()
  const [internalSelected, setInternalSelected] = useState(defaultSelected)
  const current = selected ?? internalSelected
  const currentKey = dayKeyOf(current)
  const busyDays = [...new Set(events.map((event) => event.date))].map(
    dateOfKey,
  )
  const dayEvents = events.filter((event) => event.date === currentKey)

  return (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="agenda"
      {...props}
    >
      <WidgetHeader action={action} title={title} titleId={titleId} />
      <CardPanel className="grid gap-5 px-5 pb-5">
        <Calendar
          className="mx-auto"
          defaultMonth={current}
          {...calendarProps}
          mode="single"
          modifiers={{ busy: busyDays }}
          modifiersClassNames={{
            busy: 'font-semibold underline underline-offset-4',
          }}
          onSelect={(date) => {
            if (!date) return
            if (selected === undefined) setInternalSelected(date)
            onSelect?.(date)
          }}
          selected={current}
        />
        {dayEvents.length ? (
          <ExpandableList items={dayEvents} {...expand}>
            {(shown) => (
              <ul
                aria-label={listLabel}
                className="divide-y divide-border/40"
                data-slot="agenda-events"
              >
                {shown.map((event) => (
                  <li
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                    data-slot="agenda-event"
                    key={event.id}
                  >
                    <span
                      aria-hidden="true"
                      className="size-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor: event.color ?? 'var(--chart-1)',
                      }}
                    />
                    <span className="min-w-0 flex-1 truncate font-medium text-sm">
                      {event.title}
                    </span>
                    {event.startLabel || event.endLabel ? (
                      <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
                        {event.startLabel}
                        {event.startLabel && event.endLabel ? ' – ' : null}
                        {event.endLabel}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </ExpandableList>
        ) : (
          <p className="text-muted-foreground text-sm" data-slot="agenda-empty">
            {emptyLabel}
          </p>
        )}
      </CardPanel>
    </CardWidgetShell>
  )
}
