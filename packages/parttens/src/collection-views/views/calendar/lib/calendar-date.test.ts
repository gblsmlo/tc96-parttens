import { describe, expect, test } from 'bun:test'

import {
  addCalendarDays,
  calendarDateKey,
  calendarRange,
  compareCalendarDates,
  parseCalendarDateKey,
  startOfWeek,
} from './calendar-date'

describe('calendarDateKey', () => {
  test('serializes with zero padding and parses back', () => {
    const date = { day: 5, month: 8, year: 2026 }

    expect(calendarDateKey(date)).toBe('2026-08-05')
    expect(parseCalendarDateKey('2026-08-05')).toEqual(date)
  })

  test('rejects a day that does not exist in the calendar', () => {
    expect(parseCalendarDateKey('2026-02-30')).toBeNull()
    expect(parseCalendarDateKey('2026-13-01')).toBeNull()
    expect(parseCalendarDateKey('banana')).toBeNull()
  })

  test('accepts february 29 only on leap years', () => {
    expect(parseCalendarDateKey('2024-02-29')).toEqual({
      day: 29,
      month: 2,
      year: 2024,
    })
    expect(parseCalendarDateKey('2026-02-29')).toBeNull()
  })
})

describe('addCalendarDays', () => {
  test('crosses month and year boundaries', () => {
    expect(addCalendarDays({ day: 31, month: 8, year: 2026 }, 1)).toEqual({
      day: 1,
      month: 9,
      year: 2026,
    })
    expect(addCalendarDays({ day: 28, month: 12, year: 2025 }, 7)).toEqual({
      day: 4,
      month: 1,
      year: 2026,
    })
    expect(addCalendarDays({ day: 1, month: 1, year: 2026 }, -1)).toEqual({
      day: 31,
      month: 12,
      year: 2025,
    })
  })

  test('handles the leap day', () => {
    expect(addCalendarDays({ day: 28, month: 2, year: 2024 }, 1)).toEqual({
      day: 29,
      month: 2,
      year: 2024,
    })
  })
})

describe('startOfWeek', () => {
  test('finds the previous sunday and monday', () => {
    // 2026-08-12 é uma quarta-feira.
    const wednesday = { day: 12, month: 8, year: 2026 }

    expect(startOfWeek(wednesday, 0)).toEqual({ day: 9, month: 8, year: 2026 })
    expect(startOfWeek(wednesday, 1)).toEqual({ day: 10, month: 8, year: 2026 })
  })

  test('keeps the anchor when it already starts the week', () => {
    const sunday = { day: 9, month: 8, year: 2026 }

    expect(startOfWeek(sunday, 0)).toEqual(sunday)
  })
})

describe('calendarRange', () => {
  test('day mode is the anchor alone', () => {
    const anchor = { day: 12, month: 8, year: 2026 }

    expect(calendarRange(anchor, 'day', 0)).toEqual([anchor])
  })

  test('week mode spans seven days from the week start', () => {
    const days = calendarRange({ day: 12, month: 8, year: 2026 }, 'week', 0)

    expect(days).toHaveLength(7)
    expect(days[0]).toEqual({ day: 9, month: 8, year: 2026 })
    expect(days[6]).toEqual({ day: 15, month: 8, year: 2026 })
  })

  test('month mode includes adjacent days to close full weeks', () => {
    // Agosto de 2026 começa num sábado e termina numa segunda: 6 semanas.
    const days = calendarRange({ day: 12, month: 8, year: 2026 }, 'month', 0)

    expect(days).toHaveLength(42)
    expect(days[0]).toEqual({ day: 26, month: 7, year: 2026 })
    expect(days.at(-1)).toEqual({ day: 5, month: 9, year: 2026 })
  })

  test('month mode produces five weeks when they suffice', () => {
    // Junho de 2026 começa numa segunda e cabe em 5 semanas com domingo inicial.
    const days = calendarRange({ day: 15, month: 6, year: 2026 }, 'month', 0)

    expect(days).toHaveLength(35)
    expect(days[0]).toEqual({ day: 31, month: 5, year: 2026 })
    expect(days.at(-1)).toEqual({ day: 4, month: 7, year: 2026 })
  })

  test('range is strictly ascending', () => {
    const days = calendarRange({ day: 1, month: 1, year: 2026 }, 'month', 1)

    for (let index = 1; index < days.length; index += 1) {
      const previous = days[index - 1]
      const current = days[index]
      if (!previous || !current) throw new Error('range has holes')
      expect(compareCalendarDates(previous, current)).toBeLessThan(0)
    }
  })
})
