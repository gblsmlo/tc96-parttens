/** Span of days {@link calendarRange} produces around an anchor date. */
export type CalendarRangeMode = 'day' | 'month' | 'week'

/**
 * A calendar day with no time and no time zone attached. `month` runs from
 * 1 to 12.
 */
export interface CalendarDate {
  day: number
  month: number
  year: number
}

const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * Serializes a calendar date as `YYYY-MM-DD`, a stable key for maps and DOM
 * attributes.
 *
 * @param date - The calendar date to serialize.
 */
export function calendarDateKey(date: CalendarDate): string {
  const month = String(date.month).padStart(2, '0')
  const day = String(date.day).padStart(2, '0')

  return `${date.year}-${month}-${day}`
}

/**
 * Parses a `YYYY-MM-DD` key produced by {@link calendarDateKey}.
 *
 * @param key - The serialized date.
 * @returns The calendar date, or `null` when the text is malformed or names a
 * day that does not exist, such as February 30.
 */
export function parseCalendarDateKey(key: string): CalendarDate | null {
  const match = DATE_KEY_PATTERN.exec(key)
  if (!match) return null

  const candidate = {
    day: Number(match[3]),
    month: Number(match[2]),
    year: Number(match[1]),
  }

  return isSameCalendarDate(candidate, normalizeCalendarDate(candidate))
    ? candidate
    : null
}

/**
 * Moves a calendar date by a number of days, rolling over months and years.
 *
 * @param date - The starting date.
 * @param days - Days to add; negative values move backwards.
 */
export function addCalendarDays(
  date: CalendarDate,
  days: number,
): CalendarDate {
  return normalizeCalendarDate({ ...date, day: date.day + days })
}

/**
 * Orders two calendar dates chronologically.
 *
 * @returns Negative when `a` is earlier, positive when later, zero when equal.
 */
export function compareCalendarDates(a: CalendarDate, b: CalendarDate): number {
  return a.year - b.year || a.month - b.month || a.day - b.day
}

/** Whether two calendar dates name the same day. */
export function isSameCalendarDate(a: CalendarDate, b: CalendarDate): boolean {
  return compareCalendarDates(a, b) === 0
}

/**
 * Day of the week of a calendar date.
 *
 * @returns `0` for Sunday through `6` for Saturday.
 */
export function calendarDayOfWeek(date: CalendarDate): number {
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay()
}

/**
 * First day of the week that contains a calendar date.
 *
 * @param date - Any day of the week.
 * @param weekStartsOn - `0` when weeks start on Sunday, `1` on Monday.
 */
export function startOfWeek(
  date: CalendarDate,
  weekStartsOn: 0 | 1,
): CalendarDate {
  const offset = (calendarDayOfWeek(date) - weekStartsOn + 7) % 7

  return addCalendarDays(date, -offset)
}

/**
 * Lists the days a calendar view shows for an anchor date. A month spans from
 * the first week containing the 1st to the last week containing the final day,
 * so adjacent days of neighbouring months are included.
 *
 * @param anchor - The date the view is centred on.
 * @param mode - Whether to list one day, one week or one month.
 * @param weekStartsOn - `0` when weeks start on Sunday, `1` on Monday.
 * @returns The visible days in chronological order.
 */
export function calendarRange(
  anchor: CalendarDate,
  mode: CalendarRangeMode,
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
 * Normalizes an out-of-range day or month through `Date.UTC`, which rolls it
 * over into the right month and year. Arithmetic stays in year/month/day
 * rather than adding 86400 seconds to an instant, which would break across
 * daylight saving transitions.
 */
function normalizeCalendarDate(date: CalendarDate): CalendarDate {
  const normalized = new Date(Date.UTC(date.year, date.month - 1, date.day))

  return {
    day: normalized.getUTCDate(),
    month: normalized.getUTCMonth() + 1,
    year: normalized.getUTCFullYear(),
  }
}
