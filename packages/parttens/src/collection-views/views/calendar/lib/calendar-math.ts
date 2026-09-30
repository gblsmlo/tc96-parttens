import type { CalendarDate } from '../types'

export interface ZonedDateTime {
  date: CalendarDate
  /** Minutos desde 00:00 no relógio de parede do fuso. */
  minutes: number
}

// `Intl.DateTimeFormat` é caro de construir; um formatter por fuso basta para a
// vida do módulo.
const formatterCache = new Map<string, Intl.DateTimeFormat>()

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

interface WallClockParts {
  day: number
  hour: number
  minute: number
  month: number
  second: number
  year: number
}

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

/** Projeta um instante UTC no relógio de parede do fuso. */
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
  // As partes param no segundo; comparar contra o instante truncado evita que o
  // milissegundo contamine o offset.
  const truncated =
    instant.getTime() - (((instant.getTime() % 1000) + 1000) % 1000)

  return wallAsUtc - truncated
}

/**
 * Converte relógio de parede no fuso de volta para instante UTC sem biblioteca
 * de datas: chuta o wall time como se fosse UTC e corrige pelo offset do fuso.
 * Uma segunda passada resolve borda de transição (offsets só mudam ali): hora
 * ambígua (fall-back) fica com o primeiro offset encontrado, e hora inexistente
 * (spring-forward) resolve para o instante pós-transição.
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
