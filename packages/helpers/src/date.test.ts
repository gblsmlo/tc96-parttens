import { describe, expect, test } from 'bun:test'
import {
  dayOffsetInTimeZone,
  formatRelativeDay,
  formatShortDate,
  isValidDate,
  parseDateValue,
  parseIsoDate,
  serializeIsoDay,
} from './date'

describe('isValidDate', () => {
  test('accepts only dates with a valid time', () => {
    expect(isValidDate(new Date('2026-06-19T12:00:00Z'))).toBe(true)
    expect(isValidDate(new Date('banana'))).toBe(false)
    expect(isValidDate('2026-06-19')).toBe(false)
    expect(isValidDate(null)).toBe(false)
  })
})

describe('parseIsoDate', () => {
  test('parses ISO strings and rejects empty or invalid input', () => {
    expect(parseIsoDate('2026-06-19T12:00:00.000Z')?.toISOString()).toBe(
      '2026-06-19T12:00:00.000Z',
    )
    expect(parseIsoDate(null)).toBeNull()
    expect(parseIsoDate(undefined)).toBeNull()
    expect(parseIsoDate('')).toBeNull()
    expect(parseIsoDate('not-a-date')).toBeNull()
  })
})

describe('parseDateValue', () => {
  test('keeps a Date as it is', () => {
    const date = new Date(2026, 7, 4, 10)
    expect(parseDateValue(date)).toBe(date)
  })

  test('reads a date-only string as local midnight', () => {
    const date = parseDateValue('2026-08-04')
    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(7)
    expect(date.getDate()).toBe(4)
    expect(date.getHours()).toBe(0)
  })

  test('reads any other value through the Date constructor', () => {
    expect(parseDateValue('2026-08-04T03:00:00.000Z').toISOString()).toBe(
      '2026-08-04T03:00:00.000Z',
    )
    expect(isValidDate(parseDateValue('banana'))).toBe(false)
  })
})

describe('serializeIsoDay', () => {
  test('serializes the local day as noon UTC', () => {
    expect(serializeIsoDay(new Date(2026, 5, 19))).toBe(
      '2026-06-19T12:00:00.000Z',
    )
    expect(serializeIsoDay(new Date(2026, 5, 19, 23, 59))).toBe(
      '2026-06-19T12:00:00.000Z',
    )
  })
})

describe('formatShortDate', () => {
  const date = new Date('2026-06-19T12:00:00.000Z')

  test('shows day and short month in the locale', () => {
    expect(formatShortDate(date, 'en-US', 'UTC')).toBe('Jun 19')
    expect(formatShortDate(date, 'pt-BR', 'UTC')).toBe('19 de jun.')
  })

  test('projects into the time zone when one is given', () => {
    const lateNight = new Date('2026-06-19T02:00:00.000Z')
    expect(formatShortDate(lateNight, 'en-US', 'UTC')).toBe('Jun 19')
    expect(formatShortDate(lateNight, 'en-US', 'America/Sao_Paulo')).toBe(
      'Jun 18',
    )
  })
})

describe('dayOffsetInTimeZone', () => {
  const now = new Date('2026-06-19T12:00:00.000Z')

  test('counts civil days between two instants in the zone', () => {
    expect(dayOffsetInTimeZone(now, now, 'UTC')).toBe(0)
    expect(
      dayOffsetInTimeZone(now, new Date('2026-06-20T00:30:00.000Z'), 'UTC'),
    ).toBe(1)
    expect(
      dayOffsetInTimeZone(now, new Date('2026-06-18T23:30:00.000Z'), 'UTC'),
    ).toBe(-1)
    expect(
      dayOffsetInTimeZone(now, new Date('2026-07-19T12:00:00.000Z'), 'UTC'),
    ).toBe(30)
  })

  test('follows the wall clock of the zone, not UTC', () => {
    const justAfterMidnightUtc = new Date('2026-06-20T01:00:00.000Z')
    expect(dayOffsetInTimeZone(now, justAfterMidnightUtc, 'UTC')).toBe(1)
    expect(
      dayOffsetInTimeZone(now, justAfterMidnightUtc, 'America/Sao_Paulo'),
    ).toBe(0)
  })
})

describe('formatRelativeDay', () => {
  test('names yesterday, today and tomorrow with a capital letter', () => {
    expect(formatRelativeDay(0, 'en-US')).toBe('Today')
    expect(formatRelativeDay(1, 'en-US')).toBe('Tomorrow')
    expect(formatRelativeDay(-1, 'en-US')).toBe('Yesterday')
    expect(formatRelativeDay(0, 'pt-BR')).toBe('Hoje')
    expect(formatRelativeDay(-1, 'pt-BR')).toBe('Ontem')
  })

  test('falls back to a counted phrase further away', () => {
    expect(formatRelativeDay(3, 'en-US')).toBe('In 3 days')
    expect(formatRelativeDay(-3, 'pt-BR')).toBe('Há 3 dias')
  })
})
