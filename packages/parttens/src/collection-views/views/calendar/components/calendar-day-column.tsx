'use client'

import { CollisionPriority } from '@dnd-kit/abstract'
import { pointerIntersection } from '@dnd-kit/collision'
import { useDroppable } from '@dnd-kit/react'
import { calendarDateKey } from '@tc96/helpers/calendar-date'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import { useId } from 'react'
import type { CalendarItemSegment, TimeGridLane } from '../lib/calendar-layout'
import { timeGridPosition } from '../lib/calendar-layout'
import { createCalendarDropId } from '../lib/drag-and-drop'
import type { CalendarDate } from '../types'
import { CalendarItemSkeleton } from './calendar-item-skeleton'

export interface CalendarDayColumnProps<TItem> {
  date: CalendarDate
  dropEnabled: boolean
  headingLabel: string
  isToday: boolean
  lanes: ReadonlyMap<string, TimeGridLane>
  loading: boolean
  loadingItemLabel?: string
  /** Minutos do instante corrente no fuso — posiciona a linha "agora". */
  nowMinutes: number | null
  renderSegment: (segment: CalendarItemSegment<TItem>) => ReactNode
  segments: readonly CalendarItemSegment<TItem>[]
}

export function CalendarDayColumn<TItem>({
  date,
  dropEnabled,
  headingLabel,
  isToday,
  lanes,
  loading,
  loadingItemLabel,
  nowMinutes,
  renderSegment,
  segments,
}: CalendarDayColumnProps<TItem>) {
  const instanceId = useId()
  const titleId = `calendar-day-column-title-${instanceId}`
  const dateKey = calendarDateKey(date)
  const { isDropTarget, ref } = useDroppable({
    accept: 'calendar-item',
    collisionDetector: pointerIntersection,
    collisionPriority: CollisionPriority.Lowest,
    data: { dateKey, type: 'time-column' },
    disabled: !dropEnabled,
    id: createCalendarDropId('time-column', dateKey, instanceId),
    type: 'calendar-time-column',
  })

  return (
    <section
      aria-labelledby={titleId}
      className="relative min-w-0 border-border/70 border-s"
    >
      <h3 className="sr-only" id={titleId}>
        {headingLabel}
      </h3>
      <div
        className={cn(
          // Linhas de hora por gradiente repetido: sem 24 spans por coluna e
          // sem medir o container.
          'absolute inset-0 bg-[repeating-linear-gradient(to_bottom,var(--border)_0,var(--border)_1px,transparent_1px,transparent_calc(100%/24))]',
          isDropTarget && 'bg-accent/30',
        )}
        data-calendar-date={dateKey}
        data-today={isToday ? '' : undefined}
        ref={ref}
      >
        {loading ? (
          <div className="absolute inset-x-1 top-[30%] h-[6%]">
            <CalendarItemSkeleton
              display="block"
              {...(loadingItemLabel ? { label: loadingItemLabel } : {})}
            />
          </div>
        ) : (
          segments.map((segment) => {
            const position = timeGridPosition(segment)
            const lane = lanes.get(segment.itemKey) ?? {
              laneCount: 1,
              laneIndex: 0,
            }
            const width = 100 / lane.laneCount

            return (
              <div
                className="absolute px-px"
                key={segment.itemKey}
                style={{
                  height: `${position.heightPct}%`,
                  left: `${lane.laneIndex * width}%`,
                  top: `${position.topPct}%`,
                  width: `${width}%`,
                }}
              >
                {renderSegment(segment)}
              </div>
            )
          })
        )}

        {isToday && nowMinutes !== null ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 z-10 border-destructive border-t-2"
            data-slot="calendar-now-line"
            style={{ top: `${(nowMinutes / 1440) * 100}%` }}
          >
            <span className="-start-1 -top-[5px] absolute size-2 rounded-full bg-destructive" />
          </div>
        ) : null}
      </div>
    </section>
  )
}
