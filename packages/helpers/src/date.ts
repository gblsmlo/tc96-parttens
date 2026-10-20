import type { CalendarDate } from './calendar-date'
import { toZonedDateTime } from './zoned-date-time'

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const MILLISECONDS_IN_DAY = 86_400_000

const DATE_FORMAT_OPTIONS = {
  long: { dateStyle: 'long' },
  medium: { dateStyle: 'medium' },
  short: { day: 'numeric', month: 'short' },
  weekdayAndDay: { day: 'numeric', weekday: 'long' },
} satisfies Record<string, Intl.DateTimeFormatOptions>

const dateFormatters = new Map<string, Intl.DateTimeFormat>()
const relativeDayFormatters = new Map<string, Intl.RelativeTimeFormat>()

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
  return getDateFormatter('short', locale, timeZone).format(date)
}

/**
 * Formats a date with day, abbreviated month and year, as a date picker
 * trigger shows it.
 *
 * @param date - A valid date.
 * @param locale - A BCP 47 locale tag such as `pt-BR`.
 * @param timeZone - An IANA time zone; when omitted the date is read in the
 * runtime's local zone.
 * @returns The formatted date, such as `Oct 20, 2026` or `20 de out. de 2026`.
 */
export function formatMediumDate(
  date: Date,
  locale: string,
  timeZone?: string,
): string {
  return getDateFormatter('medium', locale, timeZone).format(date)
}

/**
 * Formats a date with day, full month name and year.
 *
 * @param date - A valid date.
 * @param locale - A BCP 47 locale tag such as `pt-BR`.
 * @param timeZone - An IANA time zone; when omitted the date is read in the
 * runtime's local zone.
 * @returns The formatted date, such as `October 20, 2026` or
 * `20 de outubro de 2026`.
 */
export function formatLongDate(
  date: Date,
  locale: string,
  timeZone?: string,
): string {
  return getDateFormatter('long', locale, timeZone).format(date)
}

/**
 * Formats the weekday name with the day of the month, as a day heading over a
 * list of time slots.
 *
 * @param date - A valid date.
 * @param locale - A BCP 47 locale tag such as `pt-BR`.
 * @param timeZone - An IANA time zone; when omitted the date is read in the
 * runtime's local zone.
 * @returns The formatted day, such as `Tuesday 20` or `terça-feira, 20`.
 */
export function formatWeekdayAndDay(
  date: Date,
  locale: string,
  timeZone?: string,
): string {
  return getDateFormatter('weekdayAndDay', locale, timeZone).format(date)
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
  const label = getRelativeDayFormatter(locale).format(dayOffset, 'day')
  return label.charAt(0).toLocaleUpperCase(locale) + label.slice(1)
}

/**
 * Moves a date by a number of local calendar days, keeping its time of day.
 *
 * @param date - The starting date; it is not mutated.
 * @param days - Days to add; negative values move backwards.
 */
export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

/**
 * Moves a date by a number of months. When the target month is shorter, the
 * day is clamped to its last day, so January 31 plus one month is the end of
 * February instead of early March.
 *
 * @param date - The starting date; it is not mutated.
 * @param months - Months to add; negative values move backwards.
 */
export function addMonths(date: Date, months: number): Date {
  const next = new Date(date)
  next.setDate(1)
  next.setMonth(next.getMonth() + months)
  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
  next.setDate(Math.min(date.getDate(), lastDay))
  return next
}

/**
 * Moves a date by a number of years. February 29 becomes February 28 in a
 * common year.
 *
 * @param date - The starting date; it is not mutated.
 * @param years - Years to add; negative values move backwards.
 */
export function addYears(date: Date, years: number): Date {
  return addMonths(date, years * 12)
}

/** Building an `Intl` formatter costs ~50 formats, so one is kept per key. */
function getDateFormatter(
  style: keyof typeof DATE_FORMAT_OPTIONS,
  locale: string,
  timeZone?: string,
): Intl.DateTimeFormat {
  const key = `${style}|${locale}|${timeZone ?? ''}`
  const cached = dateFormatters.get(key)
  if (cached) return cached

  const formatter = new Intl.DateTimeFormat(locale, {
    ...DATE_FORMAT_OPTIONS[style],
    ...(timeZone ? { timeZone } : {}),
  })
  dateFormatters.set(key, formatter)

  return formatter
}

function getRelativeDayFormatter(locale: string): Intl.RelativeTimeFormat {
  const cached = relativeDayFormatters.get(locale)
  if (cached) return cached

  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  relativeDayFormatters.set(locale, formatter)

  return formatter
}

/** Days since the Unix epoch for a calendar date, ignoring time zones. */
function dayNumber(date: CalendarDate): number {
  return Date.UTC(date.year, date.month - 1, date.day) / MILLISECONDS_IN_DAY
}
