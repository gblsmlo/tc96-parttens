'use client'

import { DragDropProvider, DragOverlay } from '@dnd-kit/react'
import { calendarDateKey, calendarRange } from '@tc96/helpers/calendar-date'
import { toZonedDateTime } from '@tc96/helpers/zoned-date-time'
import type { ReactNode } from 'react'
import { useLayoutEffect, useMemo, useRef } from 'react'
import type { CollectionDefinition } from '../../../types/collection'
import { useCalendarDragAndDrop } from '../hooks/use-calendar-drag-and-drop'
import { useNow } from '../hooks/use-now'
import type { CalendarItemSegment, TimeGridLane } from '../lib/calendar-layout'
import { assignTimeGridLanes, segmentRecords } from '../lib/calendar-layout'
import { createCalendarRecordDragId } from '../lib/drag-and-drop'
import {
  type CalendarResizeDirection,
  type CalendarResizeEdge,
  stepCalendarScheduleEdge,
} from '../lib/resize'
import type {
  CalendarDate,
  CalendarRecordRenderContext,
  CalendarRecordReschedule,
  CalendarRecordSchedule,
  CalendarSlot,
  CalendarViewMode,
} from '../types'
import { CalendarMonthGrid } from './calendar-month-grid'
import { CalendarResizeHandle } from './calendar-resize-handle'
import { CalendarSegmentContent } from './calendar-segment-content'
import { CalendarTimeGrid } from './calendar-time-grid'
import { DraggableCalendarItem } from './draggable-calendar-item'

export interface CalendarViewProps<TRecord = unknown> {
  /** Instante de referência; a view projeta o período visível no `timeZone`. */
  anchor: Date
  /** Só `getKey`, `getLabel` e `items` são lidos — data não é dimensão de agrupamento estática. */
  collection: CollectionDefinition<TRecord>
  /** Nome acessível do arraste ("Mover {label}"). Default: `collection.getLabel`. */
  getRecordLabel?: (record: TRecord) => string
  /** `null` = item sem lugar no calendário; a view não o renderiza. */
  getRecordSchedule: (record: TRecord) => CalendarRecordSchedule | null
  loading?: boolean
  /** Esqueletos distribuídos pela grade durante o carregamento. */
  loadingRecordCount?: number
  loadingRecordLabel?: string
  /** Localidade dos rótulos de data e hora. */
  locale?: string
  /** Chips visíveis por célula do mês antes do "+N". */
  maxVisibleMonthRecords?: number
  mode: CalendarViewMode
  /** Instante corrente (linha "agora", destaque de hoje). Sem controle, avança por minuto. */
  now?: Date
  /** Reagendamento otimista: `false` (ou rejeição) devolve o item ao lugar. */
  onRecordReschedule?: (
    change: CalendarRecordReschedule<TRecord>,
  ) => boolean | Promise<boolean>
  onSelectSlot?: (slot: CalendarSlot) => void
  /** Título do dia no popover do "+N" de uma célula cheia do mês. */
  onSelectDay?: (date: CalendarDate) => void
  /** Incremento do arraste no time grid, em minutos. */
  snapMinutes?: number
  renderRecord: (
    record: TRecord,
    context: CalendarRecordRenderContext,
  ) => ReactNode
  /** IANA, ex. `America/Fortaleza` — toda bucketização e drop convertem na borda. */
  timeZone: string
  /** 0 = domingo. */
  weekStartsOn?: 0 | 1
}

export function CalendarView<TRecord>({
  anchor,
  collection,
  getRecordLabel,
  getRecordSchedule,
  loading = false,
  loadingRecordCount = 3,
  loadingRecordLabel,
  locale = 'pt-BR',
  maxVisibleMonthRecords = 3,
  mode,
  now: controlledNow,
  onRecordReschedule,
  onSelectDay,
  onSelectSlot,
  renderRecord,
  snapMinutes = 15,
  timeZone,
  weekStartsOn = 0,
}: CalendarViewProps<TRecord>) {
  const now = useNow(controlledNow)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const {
    dragEnabled,
    focusRecordDragId,
    handleDragEnd,
    handleDragStart,
    handleRecordFocusRestored,
    previewSchedule,
    resizeRecord,
    resolveSchedule,
  } = useCalendarDragAndDrop({
    getRecordSchedule,
    getKey: collection.getKey,
    records: collection.records,
    snapMinutes,
    timeZone,
    ...(!loading && onRecordReschedule ? { onRecordReschedule } : {}),
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
      segmentRecords({
        getRecordSchedule: resolveSchedule,
        getKey: collection.getKey,
        records: collection.records,
        range,
        timeZone,
      }),
    [collection.getKey, collection.records, range, resolveSchedule, timeZone],
  )
  const labels = useMemo(
    () => createLabelFormatters(locale, timeZone),
    [locale, timeZone],
  )

  const resolveLabel = getRecordLabel ?? collection.getLabel
  const itemsByKey = useMemo(
    () =>
      new Map(
        collection.records.map(
          (record) => [String(collection.getKey(record)), record] as const,
        ),
      ),
    [collection],
  )

  const renderSegment = (
    segment: CalendarItemSegment<TRecord>,
    placement: 'all-day' | 'month' | 'time-grid',
  ) => {
    const dateKey = calendarDateKey(segment.date)
    const label = resolveLabel(segment.record)
    const schedule =
      dragEnabled && placement === 'time-grid' && !segment.isAllDay
        ? resolveSchedule(segment.record)
        : null
    const resizable = schedule?.end != null
    const resizeGrid = { snapMinutes, timeZone }
    const resizeHandle = (edge: 'end' | 'start') =>
      schedule ? (
        <CalendarResizeHandle
          edge={edge}
          grid={resizeGrid}
          onCommit={(next) => resizeRecord(segment.recordKey, next)}
          onPreview={(next) => previewSchedule(segment.recordKey, next)}
          schedule={schedule}
        />
      ) : null
    const stepEdge = (
      edge: CalendarResizeEdge,
      direction: CalendarResizeDirection,
    ) => {
      if (!schedule) return
      const next = stepCalendarScheduleEdge(
        schedule,
        edge,
        direction,
        resizeGrid,
      )
      if (next) resizeRecord(segment.recordKey, next)
    }

    return (
      <DraggableCalendarItem
        className={placement === 'time-grid' ? 'h-full' : undefined}
        disabled={!dragEnabled}
        dragLabel={`Mover ${label}`}
        dragType={segment.isAllDay ? 'calendar-item-all-day' : 'calendar-item'}
        id={createCalendarRecordDragId(segment.recordKey, dateKey)}
        recordData={{ dateKey, recordKey: segment.recordKey, type: 'item' }}
        recordKey={segment.recordKey}
        {...(resizable ? { onResizeStep: stepEdge } : {})}
      >
        {resizable && segment.isStart ? resizeHandle('start') : null}
        <CalendarSegmentContent
          dateKey={dateKey}
          endMinutes={placement === 'time-grid' ? segment.endMinutes : null}
          isEnd={segment.isEnd}
          isStart={segment.isStart}
          record={segment.record}
          placement={placement}
          renderRecord={renderRecord}
          startMinutes={placement === 'time-grid' ? segment.startMinutes : null}
        />
        {resizable && segment.isEnd ? resizeHandle('end') : null}
      </DraggableCalendarItem>
    )
  }

  // Restaura o foco no chip que acabou de trocar de célula — o nó original é
  // desmontado no drop e o teclado perderia o fio da meada.
  useLayoutEffect(() => {
    if (!focusRecordDragId) return

    const frame = requestAnimationFrame(() => {
      const chip = Array.from(
        contentRef.current?.querySelectorAll<HTMLElement>(
          '[data-calendar-item-drag-id]',
        ) ?? [],
      ).find(
        (element) =>
          element.getAttribute('data-calendar-item-drag-id') ===
          focusRecordDragId,
      )

      if (!chip) return
      chip.focus({ preventScroll: true })
      handleRecordFocusRestored()
    })

    return () => cancelAnimationFrame(frame)
  }, [focusRecordDragId, handleRecordFocusRestored])

  const timeGrid = useMemo(() => {
    if (mode === 'month') return null

    const allDaySegmentsByDay = new Map<
      string,
      CalendarItemSegment<TRecord>[]
    >()
    const timedSegmentsByDay = new Map<string, CalendarItemSegment<TRecord>[]>()
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
            loadingRecordCount={loadingRecordCount}
            maxVisibleRecords={maxVisibleMonthRecords}
            range={range}
            renderSegment={(segment) => renderSegment(segment, 'month')}
            segmentsByDay={segmentsByDay}
            today={zonedNow.date}
            weekdayLabels={range.slice(0, 7).map(labels.weekdayShort)}
            {...(loadingRecordLabel ? { loadingRecordLabel } : {})}
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
            snapMinutes={snapMinutes}
            timedSegmentsByDay={timeGrid.timedSegmentsByDay}
            timeZoneLabel={labels.timeZoneLabel(now)}
            today={zonedNow.date}
            {...(loadingRecordLabel ? { loadingRecordLabel } : {})}
            {...(onSelectSlot && !loading ? { onSelectSlot } : {})}
          />
        ) : null}

        <DragOverlay className="pointer-events-none" dropAnimation={null}>
          {(source) => {
            const recordKey = (
              source.data as { recordKey?: string } | undefined
            )?.recordKey
            const record =
              recordKey === undefined ? undefined : itemsByKey.get(recordKey)
            if (record === undefined) return null

            const schedule = resolveSchedule(record)
            const zoned = schedule
              ? toZonedDateTime(schedule.start, timeZone)
              : null

            return renderRecord(record, {
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
