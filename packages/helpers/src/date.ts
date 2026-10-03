import type { CalendarDate } from './calendar-date'
import { toZonedDateTime } from './zoned-date-time'

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const MILLISECONDS_IN_DAY = 86_400_000

/**
 * Type guard for a `Date` whose time is not `NaN`.
 *
 * @param value - Any value, typically the result of parsing user input.
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

/**
 * Parses an ISO 8601 string, such as the value stored by a date property.
 *
 * @param value - The serialized date; empty values are treated as absent.
 * @returns The parsed date, or `null` when the value is absent or invalid.
 */
export function parseIsoDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const date = new Date(value)
  return isValidDate(date) ? date : null
}

/**
 * Coerces a cell value into a `Date`. A date-only string (`2026-08-04`) is
 * read as local midnight, because `new Date('2026-08-04')` is UTC midnight and
 * would display as the previous day in any negative time zone.
 *
 * @param value - A `Date`, a date string or anything `String()` can serialize.
 * @returns A date that may be invalid; check it with {@link isValidDate}.
 */
export function parseDateValue(value: unknown): Date {
  if (value instanceof Date) return value
  const raw = String(value)
  return DATE_ONLY_PATTERN.test(raw)
    ? new Date(`${raw}T00:00:00`)
    : new Date(raw)
}

/**
 * Serializes the local calendar day of a date as noon UTC, so the day survives
 * a round trip through any time zone.
 *
 * @param date - A date whose local year, month and day are kept.
 * @returns An ISO string such as `2026-06-19T12:00:00.000Z`.
 */
export function serializeIsoDay(date: Date): string {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12),
  ).toISOString()
}

/**
 * Formats a date as day and abbreviated month, without the year.
 *
 * @param date - A valid date.
 * @param locale - A BCP 47 locale tag such as `pt-BR`.
 * @param timeZone - An IANA time zone; when omitted the date is read in the
 * runtime's local zone, which suits local day markers.
 * @returns The formatted date, such as `Jun 19` or `19 de jun.`.
 */
export function formatShortDate(
  date: Date,
  locale: string,
  timeZone?: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    ...(timeZone ? { timeZone } : {}),
  }).format(date)
}

/**
 * Counts the civil days between two instants as seen on the wall clock of a
 * time zone, so an instant just after midnight in that zone counts as the
 * next day even when it is still the previous day in UTC.
 *
 * @param from - The reference instant, usually now.
 * @param to - The instant being measured, such as a due date.
 * @param timeZone - An IANA time zone.
 * @returns Negative when `to` falls on an earlier day than `from`.
 */
export function dayOffsetInTimeZone(
  from: Date,
  to: Date,
  timeZone: string,
): number {
  return (
    dayNumber(toZonedDateTime(to, timeZone).date) -
    dayNumber(toZonedDateTime(from, timeZone).date)
  )
}

/**
 * Names a day relative to today (`Yesterday`, `Today`, `Tomorrow`, `In 3
 * days`) with the first letter upper-cased for the locale.
 *
 * @param dayOffset - Civil days from today; see {@link dayOffsetInTimeZone}.
 * @param locale - A BCP 47 locale tag such as `pt-BR`.
 */
export function formatRelativeDay(dayOffset: number, locale: string): string {
  const label = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
    dayOffset,
    'day',
  )
  return label.charAt(0).toLocaleUpperCase(locale) + label.slice(1)
}

/** Days since the Unix epoch for a calendar date, ignoring time zones. */
function dayNumber(date: CalendarDate): number {
  return Date.UTC(date.year, date.month - 1, date.day) / MILLISECONDS_IN_DAY
}
