'use client'

import { DragDropProvider, DragOverlay } from '@dnd-kit/react'
import type { ReactNode } from 'react'
import { useLayoutEffect, useMemo, useRef } from 'react'

import type { CollectionDefinition } from '../../../types/collection'
import { useCalendarDragAndDrop } from '../hooks/use-calendar-drag-and-drop'
import { useNow } from '../hooks/use-now'
import { calendarDateKey, calendarRange } from '../lib/calendar-date'
import type { CalendarItemSegment, TimeGridLane } from '../lib/calendar-layout'
import { assignTimeGridLanes, segmentItems } from '../lib/calendar-layout'
import { toZonedDateTime } from '../lib/calendar-math'
import { createCalendarItemDragId } from '../lib/drag-and-drop'
import type {
  CalendarDate,
  CalendarItemRenderContext,
  CalendarItemReschedule,
  CalendarItemSchedule,
  CalendarViewMode,
} from '../types'
import { CalendarMonthGrid } from './calendar-month-grid'
import { CalendarTimeGrid } from './calendar-time-grid'
import { DraggableCalendarItem } from './draggable-calendar-item'

export interface CalendarViewProps<TItem = unknown> {
  /** Instante de referência; a view projeta o período visível no `timeZone`. */
  anchor: Date
  /** Só `getKey`, `getLabel` e `items` são lidos — data não é dimensão de agrupamento estática. */
  collection: CollectionDefinition<TItem>
  /** Nome acessível do arraste ("Mover {label}"). Default: `collection.getLabel`. */
  getItemLabel?: (item: TItem) => string
  /** `null` = item sem lugar no calendário; a view não o renderiza. */
  getItemSchedule: (item: TItem) => CalendarItemSchedule | null
  loading?: boolean
  /** Esqueletos distribuídos pela grade durante o carregamento. */
  loadingItemCount?: number
  loadingItemLabel?: string
  /** Localidade dos rótulos de data e hora. */
  locale?: string
  /** Chips visíveis por célula do mês antes do "+N". */
  maxVisibleMonthItems?: number
  mode: CalendarViewMode
  /** Instante corrente (linha "agora", destaque de hoje). Sem controle, avança por minuto. */
  now?: Date
  /** Reagendamento otimista: `false` (ou rejeição) devolve o item ao lugar. */
  onItemReschedule?: (
    change: CalendarItemReschedule<TItem>,
  ) => boolean | Promise<boolean>
  /** Clique no "+N" de uma célula cheia do mês. */
  onSelectDay?: (date: CalendarDate) => void
  /** Incremento do arraste no time grid, em minutos. */
  snapMinutes?: number
  renderItem: (item: TItem, context: CalendarItemRenderContext) => ReactNode
  /** IANA, ex. `America/Fortaleza` — toda bucketização e drop convertem na borda. */
  timeZone: string
  /** 0 = domingo. */
  weekStartsOn?: 0 | 1
}

export function CalendarView<TItem>({
  anchor,
  collection,
  getItemLabel,
  getItemSchedule,
  loading = false,
  loadingItemCount = 3,
  loadingItemLabel,
  locale = 'pt-BR',
  maxVisibleMonthItems = 3,
  mode,
  now: controlledNow,
  onItemReschedule,
  onSelectDay,
  renderItem,
  snapMinutes = 15,
  timeZone,
  weekStartsOn = 0,
}: CalendarViewProps<TItem>) {
  const now = useNow(controlledNow)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const {
    dragEnabled,
    focusItemDragId,
    handleDragEnd,
    handleDragStart,
    handleItemFocusRestored,
    resolveSchedule,
  } = useCalendarDragAndDrop({
    getItemSchedule,
    getKey: collection.getKey,
    items: collection.items,
    snapMinutes,
    timeZone,
    ...(!loading && onItemReschedule ? { onItemReschedule } : {}),
  })

  const anchorDate = useMemo(
    () => toZonedDateTime(anchor, timeZone).date,
    [anchor, timeZone],
  )
  const zonedNow = useMemo(
    () => toZonedDateTime(now, timeZone),
    [now, timeZone],
  )
  const range = useMemo(
    () => calendarRange(anchorDate, mode, weekStartsOn),
    [anchorDate, mode, weekStartsOn],
  )
  const segmentsByDay = useMemo(
    () =>
      segmentItems({
        getItemSchedule: resolveSchedule,
        getKey: collection.getKey,
        items: collection.items,
        range,
        timeZone,
      }),
    [collection.getKey, collection.items, range, resolveSchedule, timeZone],
  )
  const labels = useMemo(
    () => createLabelFormatters(locale, timeZone),
    [locale, timeZone],
  )

  const resolveLabel = getItemLabel ?? collection.getLabel
  const itemsByKey = useMemo(
    () =>
      new Map(
        collection.items.map(
          (item) => [String(collection.getKey(item)), item] as const,
        ),
      ),
    [collection],
  )

  const renderSegment = (
    segment: CalendarItemSegment<TItem>,
    placement: 'all-day' | 'month' | 'time-grid',
  ) => {
    const context: CalendarItemRenderContext = {
      date: segment.date,
      endMinutes: placement === 'time-grid' ? segment.endMinutes : null,
      isEnd: segment.isEnd,
      isStart: segment.isStart,
      placement,
      startMinutes: placement === 'time-grid' ? segment.startMinutes : null,
    }
    const dateKey = calendarDateKey(segment.date)

    return (
      <DraggableCalendarItem
        className={placement === 'time-grid' ? 'h-full' : undefined}
        disabled={!dragEnabled}
        dragLabel={`Mover ${resolveLabel(segment.item)}`}
        dragType={segment.isAllDay ? 'calendar-item-all-day' : 'calendar-item'}
        id={createCalendarItemDragId(segment.itemKey, dateKey)}
        itemData={{ dateKey, itemKey: segment.itemKey, type: 'item' }}
        itemKey={segment.itemKey}
      >
        {renderItem(segment.item, context)}
      </DraggableCalendarItem>
    )
  }

  // Restaura o foco no chip que acabou de trocar de célula — o nó original é
  // desmontado no drop e o teclado perderia o fio da meada.
  useLayoutEffect(() => {
    if (!focusItemDragId) return

    const frame = requestAnimationFrame(() => {
      const chip = Array.from(
        contentRef.current?.querySelectorAll<HTMLElement>(
          '[data-calendar-item-drag-id]',
        ) ?? [],
      ).find(
        (element) =>
          element.getAttribute('data-calendar-item-drag-id') ===
          focusItemDragId,
      )

      if (!chip) return
      chip.focus({ preventScroll: true })
      handleItemFocusRestored()
    })

    return () => cancelAnimationFrame(frame)
  }, [focusItemDragId, handleItemFocusRestored])

  const timeGrid = useMemo(() => {
    if (mode === 'month') return null

    const allDaySegmentsByDay = new Map<string, CalendarItemSegment<TItem>[]>()
    const timedSegmentsByDay = new Map<string, CalendarItemSegment<TItem>[]>()
    const lanesByDay = new Map<string, ReadonlyMap<string, TimeGridLane>>()

    for (const [dateKey, segments] of segmentsByDay) {
      const allDay = segments.filter((segment) => segment.isAllDay)
      const timed = segments.filter((segment) => !segment.isAllDay)
      allDaySegmentsByDay.set(dateKey, allDay)
      timedSegmentsByDay.set(dateKey, timed)
      lanesByDay.set(dateKey, assignTimeGridLanes(timed))
    }

    return { allDaySegmentsByDay, lanesByDay, timedSegmentsByDay }
  }, [mode, segmentsByDay])

  return (
    <div
      aria-busy={loading ? 'true' : undefined}
      className="flex h-full min-h-0 min-w-0 flex-col"
      data-calendar-mode={mode}
      data-slot="calendar-view"
      ref={contentRef}
    >
      <DragDropProvider onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        {mode === 'month' ? (
          <CalendarMonthGrid
            anchorMonth={anchorDate.month}
            dayLabelOf={labels.fullDate}
            dropEnabled={dragEnabled && !loading}
            gridLabel={labels.monthTitle(anchorDate)}
            loading={loading}
            loadingItemCount={loadingItemCount}
            maxVisibleItems={maxVisibleMonthItems}
            range={range}
            renderSegment={(segment) => renderSegment(segment, 'month')}
            segmentsByDay={segmentsByDay}
            today={zonedNow.date}
            weekdayLabels={range.slice(0, 7).map(labels.weekdayShort)}
            {...(loadingItemLabel ? { loadingItemLabel } : {})}
            {...(onSelectDay ? { onSelectDay } : {})}
          />
        ) : timeGrid ? (
          <CalendarTimeGrid
            allDaySegmentsByDay={timeGrid.allDaySegmentsByDay}
            columnHeadingOf={labels.fullDate}
            dayNumberLabels={range.map((date) => ({
              label: String(date.day),
              weekday: labels.weekdayShort(date),
            }))}
            dropEnabled={dragEnabled && !loading}
            gridLabel={labels.rangeTitle(range)}
            hourLabels={HOURS.map(
              (hour) => `${String(hour).padStart(2, '0')}:00`,
            )}
            lanesByDay={timeGrid.lanesByDay}
            loading={loading}
            nowMinutes={zonedNow.minutes}
            range={range}
            renderAllDaySegment={(segment) => renderSegment(segment, 'all-day')}
            renderSegment={(segment) => renderSegment(segment, 'time-grid')}
            timedSegmentsByDay={timeGrid.timedSegmentsByDay}
            timeZoneLabel={labels.timeZoneLabel(now)}
            today={zonedNow.date}
            {...(loadingItemLabel ? { loadingItemLabel } : {})}
          />
        ) : null}

        <DragOverlay className="pointer-events-none" dropAnimation={null}>
          {(source) => {
            const itemKey = (source.data as { itemKey?: string } | undefined)
              ?.itemKey
            const item =
              itemKey === undefined ? undefined : itemsByKey.get(itemKey)
            if (item === undefined) return null

            const schedule = resolveSchedule(item)
            const zoned = schedule
              ? toZonedDateTime(schedule.start, timeZone)
              : null

            return renderItem(item, {
              date: zoned?.date ?? anchorDate,
              endMinutes: null,
              isEnd: true,
              isStart: true,
              placement: mode === 'month' ? 'month' : 'time-grid',
              startMinutes: null,
            })
          }}
        </DragOverlay>
      </DragDropProvider>
    </div>
  )
}

const HOURS = Array.from({ length: 24 }, (_, hour) => hour)

function createLabelFormatters(locale: string, timeZone: string) {
  // A CalendarDate já está no fuso da view; formatar em UTC evita que o
  // Intl desloque o dia uma segunda vez.
  const asUtcDate = (date: CalendarDate) =>
    new Date(Date.UTC(date.year, date.month - 1, date.day))
  const weekday = new Intl.DateTimeFormat(locale, {
    timeZone: 'UTC',
    weekday: 'short',
  })
  const full = new Intl.DateTimeFormat(locale, {
    dateStyle: 'full',
    timeZone: 'UTC',
  })
  const month = new Intl.DateTimeFormat(locale, {
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  })
  const offset = new Intl.DateTimeFormat(locale, {
    timeZone,
    timeZoneName: 'shortOffset',
  })

  return {
    fullDate: (date: CalendarDate) => full.format(asUtcDate(date)),
    monthTitle: (date: CalendarDate) => month.format(asUtcDate(date)),
    rangeTitle: (range: readonly CalendarDate[]) => {
      const first = range[0]
      const last = range[range.length - 1]
      if (!first || !last) return ''

      return range.length === 1
        ? full.format(asUtcDate(first))
        : `${full.format(asUtcDate(first))} – ${full.format(asUtcDate(last))}`
    },
    timeZoneLabel: (instant: Date) =>
      offset.formatToParts(instant).find((part) => part.type === 'timeZoneName')
        ?.value ?? '',
    weekdayShort: (date: CalendarDate) => weekday.format(asUtcDate(date)),
  }
}
