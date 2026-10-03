import {
  addCalendarDays,
  calendarDateKey,
  compareCalendarDates,
  isSameCalendarDate,
} from '@tc96/helpers/calendar-date'
import { toZonedDateTime } from '@tc96/helpers/zoned-date-time'
import type { CalendarDate, CalendarItemSchedule } from '../types'

export const MINUTES_IN_DAY = 1440

export interface CalendarItemSegment<TItem = unknown> {
  date: CalendarDate
  /** Clampado em [0, 1440] dentro do dia. Igual ao início para instante único. */
  endMinutes: number
  isAllDay: boolean
  isEnd: boolean
  isStart: boolean
  item: TItem
  itemKey: string
  startMinutes: number
}

export interface SegmentItemsInput<TItem> {
  getItemSchedule: (item: TItem) => CalendarItemSchedule | null
  getKey: (item: TItem) => string | number
  items: readonly TItem[]
  range: readonly CalendarDate[]
  timeZone: string
}

/**
 * Fatia cada item nos dias visíveis, já no fuso da view — uma passada por item,
 * nunca uma varredura por célula. Fim em meia-noite exata não vaza para o dia
 * seguinte: `[10, 11)` de dia inteiro pertence só ao dia 10.
 */
export function segmentItems<TItem>({
  getItemSchedule,
  getKey,
  items,
  range,
  timeZone,
}: SegmentItemsInput<TItem>): Map<string, CalendarItemSegment<TItem>[]> {
  const segmentsByDay = new Map<string, CalendarItemSegment<TItem>[]>()
  const first = range[0]
  const last = range[range.length - 1]

  if (!first || !last) return segmentsByDay

  for (const day of range) segmentsByDay.set(calendarDateKey(day), [])

  for (const item of items) {
    const schedule = getItemSchedule(item)
    if (!schedule) continue

    const itemKey = String(getKey(item))
    const start = toZonedDateTime(schedule.start, timeZone)
    const effectiveEnd = schedule.end ?? schedule.start
    const end = toZonedDateTime(effectiveEnd, timeZone)
    const endsAtMidnight =
      end.minutes === 0 && compareCalendarDates(end.date, start.date) > 0
    const lastDay = endsAtMidnight ? addCalendarDays(end.date, -1) : end.date

    let day = compareCalendarDates(start.date, first) < 0 ? first : start.date
    const stop = compareCalendarDates(lastDay, last) > 0 ? last : lastDay

    for (
      ;
      compareCalendarDates(day, stop) <= 0;
      day = addCalendarDays(day, 1)
    ) {
      const bucket = segmentsByDay.get(calendarDateKey(day))
      if (!bucket) continue

      const isStart = isSameCalendarDate(day, start.date)
      const isEnd = isSameCalendarDate(day, lastDay)
      const startMinutes = isStart ? start.minutes : 0
      const endMinutes = isEnd && !endsAtMidnight ? end.minutes : MINUTES_IN_DAY

      bucket.push({
        date: day,
        endMinutes: schedule.end ? endMinutes : startMinutes,
        isAllDay: schedule.isAllDay,
        isEnd,
        isStart,
        item,
        itemKey,
        startMinutes,
      })
    }
  }

  for (const bucket of segmentsByDay.values()) {
    bucket.sort(
      (a, b) =>
        a.startMinutes - b.startMinutes || a.itemKey.localeCompare(b.itemKey),
    )
  }

  return segmentsByDay
}

export interface TimeGridPosition {
  heightPct: number
  topPct: number
}

/** Altura mínima para instante único e janela curta seguirem clicáveis. */
const MIN_HEIGHT_PCT = 2

export function timeGridPosition(segment: {
  endMinutes: number
  startMinutes: number
}): TimeGridPosition {
  const topPct = (segment.startMinutes / MINUTES_IN_DAY) * 100
  const rawHeightPct =
    ((segment.endMinutes - segment.startMinutes) / MINUTES_IN_DAY) * 100
  const heightPct = Math.max(rawHeightPct, MIN_HEIGHT_PCT)

  return {
    heightPct: Math.min(heightPct, 100 - topPct),
    topPct,
  }
}

export interface TimeGridLane {
  laneCount: number
  laneIndex: number
}

/**
 * Sobreposição por partição gulosa em lanes: segmentos que se tocam dividem a
 * largura da coluna lado a lado. Cada cluster de sobreposição fecha a própria
 * contagem — um evento isolado segue com a coluna inteira.
 */
export function assignTimeGridLanes(
  segments: readonly {
    endMinutes: number
    itemKey: string
    startMinutes: number
  }[],
): Map<string, TimeGridLane> {
  const lanes = new Map<string, TimeGridLane>()
  const ordered = [...segments].sort(
    (a, b) => a.startMinutes - b.startMinutes || b.endMinutes - a.endMinutes,
  )
  // Fim efetivo com piso de 1 minuto: instante único ainda ocupa uma lane.
  const endOf = (segment: { endMinutes: number; startMinutes: number }) =>
    Math.max(segment.endMinutes, segment.startMinutes + 1)

  let cluster: { itemKey: string }[] = []
  let laneEnds: number[] = []
  let clusterEnd = Number.NEGATIVE_INFINITY

  const flushCluster = () => {
    for (const member of cluster) {
      const lane = lanes.get(member.itemKey)
      if (lane) lane.laneCount = laneEnds.length
    }
    cluster = []
    laneEnds = []
    clusterEnd = Number.NEGATIVE_INFINITY
  }

  for (const segment of ordered) {
    if (segment.startMinutes >= clusterEnd) flushCluster()

    let laneIndex = laneEnds.findIndex((end) => end <= segment.startMinutes)
    if (laneIndex === -1) {
      laneIndex = laneEnds.length
      laneEnds.push(endOf(segment))
    } else {
      laneEnds[laneIndex] = endOf(segment)
    }

    lanes.set(segment.itemKey, { laneCount: 1, laneIndex })
    cluster.push(segment)
    clusterEnd = Math.max(clusterEnd, endOf(segment))
  }

  flushCluster()

  return lanes
}
