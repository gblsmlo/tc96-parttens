'use client'

import { ScrollArea } from '@tc96/ui/scroll-area'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

import { calendarDateKey, isSameCalendarDate } from '../lib/calendar-date'
import type { CalendarItemSegment, TimeGridLane } from '../lib/calendar-layout'
import type { CalendarDate } from '../types'
import { CalendarAllDayCell } from './calendar-all-day-cell'
import { CalendarDayColumn } from './calendar-day-column'

/** Altura fixa por hora: layout determinístico, sem medir o container. */
const HOUR_HEIGHT_REM = 3
const INITIAL_SCROLL_HOUR = 7

export interface CalendarTimeGridProps<TItem> {
  allDaySegmentsByDay: ReadonlyMap<string, CalendarItemSegment<TItem>[]>
  columnHeadingOf: (date: CalendarDate) => string
  dayNumberLabels: readonly { label: string; weekday: string }[]
  dropEnabled: boolean
  gridLabel: string
  hourLabels: readonly string[]
  lanesByDay: ReadonlyMap<string, ReadonlyMap<string, TimeGridLane>>
  loading: boolean
  loadingItemLabel?: string
  nowMinutes: number | null
  range: readonly CalendarDate[]
  renderAllDaySegment: (segment: CalendarItemSegment<TItem>) => ReactNode
  renderSegment: (segment: CalendarItemSegment<TItem>) => ReactNode
  timedSegmentsByDay: ReadonlyMap<string, CalendarItemSegment<TItem>[]>
  timeZoneLabel: string
  today: CalendarDate
}

export function CalendarTimeGrid<TItem>({
  allDaySegmentsByDay,
  columnHeadingOf,
  dayNumberLabels,
  dropEnabled,
  gridLabel,
  hourLabels,
  lanesByDay,
  loading,
  loadingItemLabel,
  nowMinutes,
  range,
  renderAllDaySegment,
  renderSegment,
  timedSegmentsByDay,
  timeZoneLabel,
  today,
}: CalendarTimeGridProps<TItem>) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const columnsTemplate = `4rem repeat(${range.length}, minmax(0, 1fr))`

  // O dia útil começa bem depois da meia-noite; abrir a grade já em ~07h evita
  // um scroll manual a cada visita.
  useEffect(() => {
    const viewport = viewportRef.current?.querySelector(
      '[data-slot=scroll-area-viewport]',
    )
    if (!(viewport instanceof HTMLElement)) return

    const rem =
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize) ||
      16
    viewport.scrollTop = INITIAL_SCROLL_HOUR * HOUR_HEIGHT_REM * rem
  }, [])

  return (
    <div
      className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-border/70"
      data-slot="calendar-time-grid"
    >
      <h2 className="sr-only">{gridLabel}</h2>

      <div
        className="grid border-border/70 border-b"
        style={{ gridTemplateColumns: columnsTemplate }}
      >
        <div className="px-2 py-2 text-end text-[10px] text-muted-foreground">
          {timeZoneLabel}
        </div>
        {range.map((date, index) => {
          const labels = dayNumberLabels[index]

          return (
            <div
              aria-hidden="true"
              className="flex items-baseline justify-center gap-1 border-border/70 border-s px-1.5 py-2"
              data-today={isSameCalendarDate(date, today) ? '' : undefined}
              key={calendarDateKey(date)}
            >
              <span className="text-muted-foreground text-xs">
                {labels?.weekday}
              </span>
              <span
                className={cn(
                  'flex size-6 items-center justify-center rounded-full font-medium text-sm tabular-nums',
                  isSameCalendarDate(date, today) &&
                    'bg-primary text-primary-foreground',
                )}
              >
                {labels?.label}
              </span>
            </div>
          )
        })}
      </div>

      <div
        className="grid border-border/70 border-b"
        style={{ gridTemplateColumns: columnsTemplate }}
      >
        <div className="px-2 py-1 text-end text-[10px] text-muted-foreground">
          <span className="sr-only">Dia inteiro</span>
          <span aria-hidden="true">dia inteiro</span>
        </div>
        {range.map((date) => (
          <CalendarAllDayCell
            date={date}
            dropEnabled={dropEnabled}
            key={calendarDateKey(date)}
            renderSegment={renderAllDaySegment}
            segments={allDaySegmentsByDay.get(calendarDateKey(date)) ?? []}
          />
        ))}
      </div>

      <ScrollArea
        className="min-h-0 flex-1"
        fill
        ref={viewportRef}
        scrollbarGutter
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: columnsTemplate,
            height: `${24 * HOUR_HEIGHT_REM}rem`,
          }}
        >
          <div aria-hidden="true" className="relative">
            {hourLabels.map((label, hour) => (
              <span
                className="absolute end-2 translate-y-[-50%] text-[10px] text-muted-foreground tabular-nums"
                key={label}
                style={{ top: `${(hour / 24) * 100}%` }}
              >
                {hour === 0 ? '' : label}
              </span>
            ))}
          </div>

          {range.map((date) => (
            <CalendarDayColumn
              date={date}
              dropEnabled={dropEnabled}
              headingLabel={columnHeadingOf(date)}
              isToday={isSameCalendarDate(date, today)}
              key={calendarDateKey(date)}
              lanes={lanesByDay.get(calendarDateKey(date)) ?? new Map()}
              loading={loading}
              nowMinutes={nowMinutes}
              renderSegment={renderSegment}
              segments={timedSegmentsByDay.get(calendarDateKey(date)) ?? []}
              {...(loadingItemLabel ? { loadingItemLabel } : {})}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
