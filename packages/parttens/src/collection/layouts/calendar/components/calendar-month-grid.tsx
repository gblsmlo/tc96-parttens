'use client'

import {
  calendarDateKey,
  isSameCalendarDate,
} from '@tc96/helpers/calendar-date'
import type { ReactNode } from 'react'
import type { CalendarItemSegment } from '../lib/calendar-layout'
import type { CalendarDate } from '../types'
import { CalendarMonthDayCell } from './calendar-month-day-cell'

export interface CalendarMonthGridProps<TRecord> {
  anchorMonth: number
  dayLabelOf: (date: CalendarDate) => string
  dropEnabled: boolean
  gridLabel: string
  loading: boolean
  loadingRecordCount: number
  loadingRecordLabel?: string
  maxVisibleRecords: number
  onSelectDay?: (date: CalendarDate) => void
  range: readonly CalendarDate[]
  renderSegment: (segment: CalendarItemSegment<TRecord>) => ReactNode
  segmentsByDay: ReadonlyMap<string, CalendarItemSegment<TRecord>[]>
  today: CalendarDate
  weekdayLabels: readonly string[]
}

export function CalendarMonthGrid<TRecord>({
  anchorMonth,
  dayLabelOf,
  dropEnabled,
  gridLabel,
  loading,
  loadingRecordCount,
  loadingRecordLabel,
  maxVisibleRecords,
  onSelectDay,
  range,
  renderSegment,
  segmentsByDay,
  today,
  weekdayLabels,
}: CalendarMonthGridProps<TRecord>) {
  const weeks: CalendarDate[][] = []
  for (let index = 0; index < range.length; index += 7) {
    weeks.push(range.slice(index, index + 7) as CalendarDate[])
  }

  return (
    <div
      className="grid min-w-0 overflow-hidden rounded-lg border border-border/80 bg-border/70"
      data-slot="calendar-month-grid"
    >
      <h2 className="sr-only">{gridLabel}</h2>
      <div aria-hidden="true" className="grid grid-cols-7 gap-px">
        {weekdayLabels.map((label) => (
          <div
            className="bg-background px-1.5 py-2 text-center font-medium text-muted-foreground text-xs"
            key={label}
          >
            {label}
          </div>
        ))}
      </div>

      {weeks.map((week, weekIndex) => (
        <div
          className="grid grid-cols-7 gap-px pt-px"
          key={calendarDateKey(week[0] as CalendarDate)}
        >
          {week.map((date, dayIndex) => {
            const position = weekIndex * 7 + dayIndex

            return (
              <CalendarMonthDayCell
                date={date}
                dayLabel={dayLabelOf(date)}
                dropEnabled={dropEnabled}
                isOutsideMonth={date.month !== anchorMonth}
                isToday={isSameCalendarDate(date, today)}
                key={calendarDateKey(date)}
                loading={loading}
                maxVisibleRecords={maxVisibleRecords}
                overflowLabel={(hiddenCount) => `+${hiddenCount}`}
                renderSegment={renderSegment}
                segments={segmentsByDay.get(calendarDateKey(date)) ?? []}
                showSkeleton={loading && position < loadingRecordCount}
                {...(loadingRecordLabel ? { loadingRecordLabel } : {})}
                {...(onSelectDay ? { onSelectDay } : {})}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
