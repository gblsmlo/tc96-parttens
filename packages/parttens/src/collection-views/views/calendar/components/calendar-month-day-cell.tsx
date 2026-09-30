'use client'

import { CollisionPriority } from '@dnd-kit/abstract'
import { pointerIntersection } from '@dnd-kit/collision'
import { useDroppable } from '@dnd-kit/react'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import { useId } from 'react'

import { calendarDateKey } from '../lib/calendar-date'
import type { CalendarItemSegment } from '../lib/calendar-layout'
import { createCalendarDropId } from '../lib/drag-and-drop'
import type { CalendarDate } from '../types'
import { CalendarItemSkeleton } from './calendar-item-skeleton'

export interface CalendarMonthDayCellProps<TItem> {
  date: CalendarDate
  dayLabel: string
  dropEnabled: boolean
  isOutsideMonth: boolean
  isToday: boolean
  loading: boolean
  loadingItemLabel?: string
  maxVisibleItems: number
  onSelectDay?: (date: CalendarDate) => void
  overflowLabel: (hiddenCount: number) => string
  renderSegment: (segment: CalendarItemSegment<TItem>) => ReactNode
  segments: readonly CalendarItemSegment<TItem>[]
  showSkeleton: boolean
}

export function CalendarMonthDayCell<TItem>({
  date,
  dayLabel,
  dropEnabled,
  isOutsideMonth,
  isToday,
  loading,
  loadingItemLabel,
  maxVisibleItems,
  onSelectDay,
  overflowLabel,
  renderSegment,
  segments,
  showSkeleton,
}: CalendarMonthDayCellProps<TItem>) {
  const instanceId = useId()
  const dateKey = calendarDateKey(date)
  const { isDropTarget, ref } = useDroppable({
    accept: ['calendar-item', 'calendar-item-all-day'],
    collisionDetector: pointerIntersection,
    collisionPriority: CollisionPriority.Lowest,
    data: { dateKey, type: 'day' },
    disabled: !dropEnabled,
    id: createCalendarDropId('day', dateKey, instanceId),
    type: 'calendar-day',
  })
  const visibleSegments = loading ? [] : segments.slice(0, maxVisibleItems)
  const hiddenCount = loading ? 0 : segments.length - visibleSegments.length

  return (
    <div
      className={cn(
        'flex min-h-24 min-w-0 flex-col gap-1 bg-background p-1.5',
        isOutsideMonth && 'bg-muted/30 text-muted-foreground',
        isDropTarget && 'bg-accent/40 ring-1 ring-ring ring-inset',
      )}
      data-calendar-date={dateKey}
      data-outside-month={isOutsideMonth ? '' : undefined}
      data-today={isToday ? '' : undefined}
      ref={ref}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-6 items-center justify-center rounded-full text-xs tabular-nums',
          isToday && 'bg-primary font-semibold text-primary-foreground',
        )}
      >
        {date.day}
      </span>

      {showSkeleton ? (
        <CalendarItemSkeleton
          {...(loadingItemLabel ? { label: loadingItemLabel } : {})}
        />
      ) : null}

      {visibleSegments.map((segment) => (
        <div className="min-w-0" key={segment.itemKey}>
          {renderSegment(segment)}
        </div>
      ))}

      {hiddenCount > 0 ? (
        onSelectDay ? (
          <button
            aria-label={`Mostrar todos os ${segments.length} itens de ${dayLabel}`}
            className="self-start rounded px-1.5 text-muted-foreground text-xs outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onSelectDay(date)}
            type="button"
          >
            {overflowLabel(hiddenCount)}
          </button>
        ) : (
          <span className="self-start px-1.5 text-muted-foreground text-xs">
            {overflowLabel(hiddenCount)}
          </span>
        )
      ) : null}
    </div>
  )
}
