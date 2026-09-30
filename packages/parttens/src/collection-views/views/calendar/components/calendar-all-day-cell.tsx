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

export interface CalendarAllDayCellProps<TItem> {
  date: CalendarDate
  dropEnabled: boolean
  renderSegment: (segment: CalendarItemSegment<TItem>) => ReactNode
  segments: readonly CalendarItemSegment<TItem>[]
}

export function CalendarAllDayCell<TItem>({
  date,
  dropEnabled,
  renderSegment,
  segments,
}: CalendarAllDayCellProps<TItem>) {
  const instanceId = useId()
  const dateKey = calendarDateKey(date)
  const { isDropTarget, ref } = useDroppable({
    accept: 'calendar-item-all-day',
    collisionDetector: pointerIntersection,
    collisionPriority: CollisionPriority.Lowest,
    data: { dateKey, type: 'all-day' },
    disabled: !dropEnabled,
    id: createCalendarDropId('all-day', dateKey, instanceId),
    type: 'calendar-all-day',
  })

  return (
    <div
      className={cn(
        'flex min-h-7 min-w-0 flex-col gap-0.5 border-border/70 border-s p-0.5',
        isDropTarget && 'bg-accent/40',
      )}
      data-calendar-all-day-date={dateKey}
      ref={ref}
    >
      {segments.map((segment) => (
        <div className="min-w-0" key={segment.itemKey}>
          {renderSegment(segment)}
        </div>
      ))}
    </div>
  )
}
