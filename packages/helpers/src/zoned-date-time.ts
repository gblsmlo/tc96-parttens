import type { CalendarDate } from './calendar-date'

/**
 * A wall-clock reading in some time zone: the calendar day and the minutes
 * elapsed since local midnight.
 */
export interface ZonedDateTime {
  date: CalendarDate
  minutes: number
}

const formatterCache = new Map<string, Intl.DateTimeFormat>()

/**
 * Returns the formatter for a time zone. `Intl.DateTimeFormat` is expensive
 * to construct, so one instance per zone is kept for the life of the module.
 */
function getFormatter(timeZone: string): Intl.DateTimeFormat {
  const cached = formatterCache.get(timeZone)
  if (cached) return cached

  const formatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    month: '2-digit',
    second: '2-digit',
    timeZone,
    year: 'numeric',
  })
  formatterCache.set(timeZone, formatter)

  return formatter
}

/** Numeric date and time fields of an instant, read in a time zone. */
interface WallClockParts {
  day: number
  hour: number
  minute: number
  month: number
  second: number
  year: number
}

/**
 * Reads the wall-clock fields of an instant in a time zone.
 *
 * @param instant - The UTC instant to project.
 * @param timeZone - An IANA time zone.
 */
function wallClockPartsOf(instant: Date, timeZone: string): WallClockParts {
  const parts: Partial<WallClockParts> = {}

  for (const part of getFormatter(timeZone).formatToParts(instant)) {
    if (part.type === 'literal') continue
    if (part.type in partKeys)
      parts[partKeys[part.type as keyof typeof partKeys]] = Number(part.value)
  }

  return parts as WallClockParts
}

const partKeys = {
  day: 'day',
  hour: 'hour',
  minute: 'minute',
  month: 'month',
  second: 'second',
  year: 'year',
} as const

/**
 * Projects a UTC instant onto the wall clock of a time zone.
 *
 * @param instant - The UTC instant to project.
 * @param timeZone - An IANA time zone.
 * @returns The calendar day and the minutes since local midnight.
 */
export function toZonedDateTime(
  instant: Date,
  timeZone: string,
): ZonedDateTime {
  const parts = wallClockPartsOf(instant, timeZone)

  return {
    date: { day: parts.day, month: parts.month, year: parts.year },
    minutes: parts.hour * 60 + parts.minute,
  }
}

/**
 * Offset of a time zone from UTC at a given instant. The formatter stops at
 * seconds, so the instant is truncated to the second before comparing;
 * otherwise milliseconds would leak into the offset.
 *
 * @param instant - The UTC instant to measure at.
 * @param timeZone - An IANA time zone.
 * @returns The offset in milliseconds; positive east of UTC.
 */
export function getTimeZoneOffsetMs(instant: Date, timeZone: string): number {
  const parts = wallClockPartsOf(instant, timeZone)
  const wallAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  )
  const truncated =
    instant.getTime() - (((instant.getTime() % 1000) + 1000) % 1000)

  return wallAsUtc - truncated
}

/**
 * Converts a wall-clock reading in a time zone back to a UTC instant without a
 * date library: the wall time is first treated as UTC and then corrected by the
 * zone offset. A second pass handles transition edges, since offsets only
 * change there: an ambiguous time (fall back) keeps the first offset found,
 * and a nonexistent time (spring forward) resolves to the instant after the
 * transition.
 *
 * @param zoned - The calendar day and minutes since local midnight.
 * @param timeZone - An IANA time zone.
 * @returns The UTC instant that shows that wall time in the zone.
 */
export function fromZonedDateTime(
  zoned: ZonedDateTime,
  timeZone: string,
): Date {
  const { date, minutes } = zoned
  const guess = Date.UTC(date.year, date.month - 1, date.day, 0, minutes)
  const firstOffset = getTimeZoneOffsetMs(new Date(guess), timeZone)
  const candidate = guess - firstOffset
  const secondOffset = getTimeZoneOffsetMs(new Date(candidate), timeZone)

  if (firstOffset === secondOffset) return new Date(candidate)

  const corrected = guess - secondOffset
  const projected = toZonedDateTime(new Date(corrected), timeZone)
  const matchesWall =
    projected.minutes === ((minutes % 1440) + 1440) % 1440 &&
    projected.date.day === date.day &&
    projected.date.month === date.month &&
    projected.date.year === date.year

  return matchesWall ? new Date(corrected) : new Date(candidate)
}
