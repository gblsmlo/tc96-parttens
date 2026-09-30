import type { DragEndEvent } from '@dnd-kit/react'

import type { CalendarDate, CalendarItemSchedule } from '../types'
import { parseCalendarDateKey } from './calendar-date'
import { MINUTES_IN_DAY } from './calendar-layout'
import { fromZonedDateTime, toZonedDateTime } from './calendar-math'

const ITEM_DRAG_PREFIX = 'calendar-item:'
const DROP_PREFIX = 'calendar-drop:'

export type CalendarDropKind = 'all-day' | 'day' | 'time-column'

export interface CalendarDropData {
  dateKey: string
  type: CalendarDropKind
  [key: string]: unknown
}

export interface CalendarItemDragData {
  dateKey: string
  itemKey: string
  type: 'item'
  [key: string]: unknown
}

/**
 * O mesmo item aparece em vários segmentos quando cruza dias; o dateKey no id
 * desambigua qual segmento está sendo arrastado.
 */
export function createCalendarItemDragId(
  itemKey: string,
  dateKey: string,
): string {
  return `${ITEM_DRAG_PREFIX}${encodeURIComponent(itemKey)}:${dateKey}`
}

export function parseCalendarItemDragId(
  id: string | number,
): { dateKey: string; itemKey: string } | null {
  const value = String(id)
  if (!value.startsWith(ITEM_DRAG_PREFIX)) return null

  const rest = value.slice(ITEM_DRAG_PREFIX.length)
  const separator = rest.lastIndexOf(':')
  if (separator === -1) return null

  const encodedItemKey = rest.slice(0, separator)
  const dateKey = rest.slice(separator + 1)

  try {
    return { dateKey, itemKey: decodeURIComponent(encodedItemKey) }
  } catch {
    return { dateKey, itemKey: encodedItemKey }
  }
}

export function createCalendarDropId(
  kind: CalendarDropKind,
  dateKey: string,
  instanceId: string,
): string {
  return `${DROP_PREFIX}${kind}:${dateKey}:${encodeURIComponent(instanceId)}`
}

/**
 * Mês e faixa all-day: muda a data preservando a hora de parede e a duração em
 * ms absolutos — arrastar através de uma transição de horário de verão mantém a
 * duração real do compromisso, não a de parede.
 */
export function resolveDayDrop(
  schedule: CalendarItemSchedule,
  targetDate: CalendarDate,
  timeZone: string,
): { end: Date | null; start: Date } {
  const zoned = toZonedDateTime(schedule.start, timeZone)
  const start = fromZonedDateTime(
    { date: targetDate, minutes: zoned.minutes },
    timeZone,
  )
  const durationMs = schedule.end
    ? schedule.end.getTime() - schedule.start.getTime()
    : null

  return {
    end: durationMs === null ? null : new Date(start.getTime() + durationMs),
    start,
  }
}

/** Fração vertical da coluna → minutos com snap, clampado dentro do dia. */
export function snapToSlot(offsetRatio: number, snapMinutes: number): number {
  const minutes =
    Math.round((offsetRatio * MINUTES_IN_DAY) / snapMinutes) * snapMinutes

  return Math.min(Math.max(minutes, 0), MINUTES_IN_DAY - snapMinutes)
}

export function resolveTimeColumnDrop(
  schedule: CalendarItemSchedule,
  targetDate: CalendarDate,
  minutes: number,
  timeZone: string,
): { end: Date | null; start: Date } {
  const start = fromZonedDateTime({ date: targetDate, minutes }, timeZone)
  const durationMs = schedule.end
    ? schedule.end.getTime() - schedule.start.getTime()
    : null

  return {
    end: durationMs === null ? null : new Date(start.getTime() + durationMs),
    start,
  }
}

/**
 * Casca impura chamada no fim do arraste: lê o alvo e a geometria do drop e
 * delega às resoluções puras. A borda superior do bloco arrastado define o novo
 * início; sem geometria disponível, o ponteiro é o fallback.
 */
export function resolveCalendarDrop(
  event: DragEndEvent,
  schedule: CalendarItemSchedule,
  timeZone: string,
  snapMinutes: number,
): { end: Date | null; start: Date } | undefined {
  const target = event.operation.target
  const data = target?.data as CalendarDropData | undefined
  if (!target || !data?.dateKey) return undefined

  const targetDate = parseCalendarDateKey(data.dateKey)
  if (!targetDate) return undefined

  if (data.type === 'day' || data.type === 'all-day') {
    return resolveDayDrop(schedule, targetDate, timeZone)
  }

  if (data.type !== 'time-column') return undefined

  const element = target.element
  if (!(element instanceof Element)) return undefined

  const rect = element.getBoundingClientRect()
  if (rect.height <= 0) return undefined

  const topEdge =
    event.operation.shape?.current.boundingRectangle.top ??
    event.operation.position.current.y
  const minutes = snapToSlot((topEdge - rect.top) / rect.height, snapMinutes)

  return resolveTimeColumnDrop(schedule, targetDate, minutes, timeZone)
}
