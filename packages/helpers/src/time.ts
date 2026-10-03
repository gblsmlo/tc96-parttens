export interface TimeOfDayOptions {
  hourCycle?: 'h11' | 'h12' | 'h23' | 'h24'
  locale?: string
  timeZone?: string
}

export interface TimeOfDayParts {
  dayPeriod: string
  hourMinute: string
  second: string
}

function timeFormatter(
  options: TimeOfDayOptions,
  withSeconds: boolean,
): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(options.locale ?? 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    ...(withSeconds ? { second: '2-digit' } : {}),
    ...(options.hourCycle ? { hourCycle: options.hourCycle } : {}),
    ...(options.timeZone ? { timeZone: options.timeZone } : {}),
  })
}

/**
 * Formats the wall-clock time of an instant, such as `9:11 PM` or `21:11`.
 *
 * @param date - The instant to format.
 * @param options - Locale (defaults to `en-US`), IANA time zone (defaults to
 * the runtime's zone) and hour cycle (defaults to the locale's).
 */
export function formatTimeOfDay(
  date: Date,
  options: TimeOfDayOptions = {},
): string {
  return timeFormatter(options, false).format(date)
}

/**
 * Splits a wall-clock time into the pieces a clock renders at different
 * weights: hour and minute, the seconds with their separator, and the day
 * period with its leading space.
 *
 * @param date - The instant to split.
 * @param options - See {@link formatTimeOfDay}.
 * @returns For `en-US` at 21:11:20, `{ hourMinute: '9:11', second: ':20',
 * dayPeriod: ' PM' }`; `second` and `dayPeriod` are empty when the locale
 * omits them.
 */
export function splitTimeOfDay(
  date: Date,
  options: TimeOfDayOptions = {},
): TimeOfDayParts {
  const parts = timeFormatter(options, true).formatToParts(date)
  const secondIndex = parts.findIndex((part) => part.type === 'second')
  const periodIndex = parts.findIndex((part) => part.type === 'dayPeriod')
  const text = (from: number, to: number) =>
    parts
      .slice(from, to)
      .map((part) => part.value)
      .join('')
  const hourMinuteEnd =
    secondIndex > 0
      ? secondIndex - 1
      : periodIndex > 0
        ? periodIndex
        : parts.length
  const periodStart = periodIndex > 0 ? periodIndex - 1 : parts.length
  return {
    dayPeriod: text(periodStart, parts.length).replace(/^\s+/, ' '),
    hourMinute: text(0, hourMinuteEnd).trim(),
    second:
      secondIndex > 0
        ? text(secondIndex - 1, Math.min(periodStart, secondIndex + 1))
        : '',
  }
}
