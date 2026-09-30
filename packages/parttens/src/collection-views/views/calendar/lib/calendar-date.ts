import type { CalendarDate, CalendarViewMode } from '../types'

const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export function calendarDateKey(date: CalendarDate): string {
  const month = String(date.month).padStart(2, '0')
  const day = String(date.day).padStart(2, '0')

  return `${date.year}-${month}-${day}`
}

export function parseCalendarDateKey(key: string): CalendarDate | null {
  const match = DATE_KEY_PATTERN.exec(key)
  if (!match) return null

  const candidate = {
    day: Number(match[3]),
    month: Number(match[2]),
    year: Number(match[1]),
  }

  // Re-serializar via Date.UTC pega dia inexistente ('2026-02-30') sem tabela
  // de meses: o construtor normaliza e a comparação de volta denuncia.
  return isSameCalendarDate(candidate, normalizeCalendarDate(candidate))
    ? candidate
    : null
}

export function addCalendarDays(
  date: CalendarDate,
  days: number,
): CalendarDate {
  return normalizeCalendarDate({ ...date, day: date.day + days })
}

export function compareCalendarDates(a: CalendarDate, b: CalendarDate): number {
  return a.year - b.year || a.month - b.month || a.day - b.day
}

export function isSameCalendarDate(a: CalendarDate, b: CalendarDate): boolean {
  return compareCalendarDates(a, b) === 0
}

/** 0 = domingo … 6 = sábado. */
export function calendarDayOfWeek(date: CalendarDate): number {
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay()
}

export function startOfWeek(
  date: CalendarDate,
  weekStartsOn: 0 | 1,
): CalendarDate {
  const offset = (calendarDayOfWeek(date) - weekStartsOn + 7) % 7

  return addCalendarDays(date, -offset)
}

/**
 * Dias visíveis para uma âncora e um modo. O mês vai da primeira semana que
 * contém o dia 1 até a última que contém o último dia — dias adjacentes
 * incluídos, como na grade da Agenda (`TASK-044`).
 */
export function calendarRange(
  anchor: CalendarDate,
  mode: CalendarViewMode,
  weekStartsOn: 0 | 1,
): CalendarDate[] {
  if (mode === 'day') return [anchor]

  if (mode === 'week') {
    const first = startOfWeek(anchor, weekStartsOn)

    return Array.from({ length: 7 }, (_, index) =>
      addCalendarDays(first, index),
    )
  }

  const firstOfMonth = { ...anchor, day: 1 }
  const lastOfMonth = addCalendarDays(
    {
      ...normalizeCalendarDate({ ...anchor, day: 1, month: anchor.month + 1 }),
    },
    -1,
  )
  const first = startOfWeek(firstOfMonth, weekStartsOn)
  const last = addCalendarDays(startOfWeek(lastOfMonth, weekStartsOn), 6)
  const days: CalendarDate[] = []

  for (
    let day = first;
    compareCalendarDates(day, last) <= 0;
    day = addCalendarDays(day, 1)
  ) {
    days.push(day)
  }

  return days
}

/**
 * A aritmética anda em Y/M/D puro via `Date.UTC` — nunca somando 86400s a um
 * instante, o que quebraria em transição de horário de verão.
 */
function normalizeCalendarDate(date: CalendarDate): CalendarDate {
  const normalized = new Date(Date.UTC(date.year, date.month - 1, date.day))

  return {
    day: normalized.getUTCDate(),
    month: normalized.getUTCMonth() + 1,
    year: normalized.getUTCFullYear(),
  }
}
