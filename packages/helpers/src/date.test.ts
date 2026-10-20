import { describe, expect, test } from 'bun:test'
import {
  addDays,
  addMonths,
  addYears,
  dayOffsetInTimeZone,
  formatLongDate,
  formatMediumDate,
  formatRelativeDay,
  formatShortDate,
  formatWeekdayAndDay,
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

describe('formatMediumDate', () => {
  const date = new Date('2026-10-20T12:00:00.000Z')

  test('shows day, short month and year in the locale', () => {
    expect(formatMediumDate(date, 'en-US', 'UTC')).toBe('Oct 20, 2026')
    expect(formatMediumDate(date, 'pt-BR', 'UTC')).toBe('20 de out. de 2026')
  })

  test('projects into the time zone when one is given', () => {
    const lateNight = new Date('2026-10-20T02:00:00.000Z')
    expect(formatMediumDate(lateNight, 'en-US', 'America/Sao_Paulo')).toBe(
      'Oct 19, 2026',
    )
  })
})

describe('formatLongDate', () => {
  const date = new Date('2026-10-20T12:00:00.000Z')

  test('shows day, full month and year in the locale', () => {
    expect(formatLongDate(date, 'en-US', 'UTC')).toBe('October 20, 2026')
    expect(formatLongDate(date, 'pt-BR', 'UTC')).toBe('20 de outubro de 2026')
  })
})

describe('formatWeekdayAndDay', () => {
  const date = new Date('2026-10-20T12:00:00.000Z')

  test('shows the weekday name and the day in the locale', () => {
    // ICU orders them per runtime: `Tuesday 20` on macOS, `20 Tuesday` on Linux.
    const english = formatWeekdayAndDay(date, 'en-US', 'UTC')
    const portuguese = formatWeekdayAndDay(date, 'pt-BR', 'UTC')

    expect(english).toContain('Tuesday')
    expect(english).toMatch(/\b20\b/)
    expect(english).not.toMatch(/Oct|2026/)
    expect(portuguese).toContain('terça-feira')
    expect(portuguese).toMatch(/\b20\b/)
    expect(portuguese).not.toMatch(/out|2026/)
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

describe('formatter reuse', () => {
  const date = new Date('2026-10-20T12:00:00.000Z')

  function countConstructions(
    constructorName: 'DateTimeFormat' | 'RelativeTimeFormat',
    run: () => void,
  ): number {
    const native = Reflect.get(Intl, constructorName)
    let count = 0
    Reflect.set(
      Intl,
      constructorName,
      new Proxy(native, {
        construct(target, args) {
          count++
          return Reflect.construct(target, args)
        },
      }),
    )
    try {
      run()
    } finally {
      Reflect.set(Intl, constructorName, native)
    }
    return count
  }

  test('builds one date formatter per helper, locale and time zone', () => {
    const built = countConstructions('DateTimeFormat', () => {
      formatShortDate(date, 'en-GB', 'Asia/Tokyo')
      formatShortDate(date, 'en-GB', 'Asia/Tokyo')
      formatShortDate(date, 'en-GB', 'Europe/Lisbon')
      formatShortDate(date, 'en-GB')
      formatShortDate(date, 'fr-FR', 'Asia/Tokyo')
      formatMediumDate(date, 'en-GB', 'Asia/Tokyo')
      formatLongDate(date, 'en-GB', 'Asia/Tokyo')
      formatWeekdayAndDay(date, 'en-GB', 'Asia/Tokyo')
      formatWeekdayAndDay(date, 'en-GB', 'Asia/Tokyo')
    })
    expect(built).toBe(7)
  })

  test('builds one relative day formatter per locale', () => {
    const built = countConstructions('RelativeTimeFormat', () => {
      formatRelativeDay(0, 'en-GB')
      formatRelativeDay(1, 'en-GB')
      formatRelativeDay(-1, 'fr-FR')
    })
    expect(built).toBe(2)
  })
})

describe('addDays', () => {
  test('rolls over months and years without mutating the input', () => {
    const date = new Date(2026, 11, 30, 9, 15)
    expect(addDays(date, 3)).toEqual(new Date(2027, 0, 2, 9, 15))
    expect(addDays(date, -30)).toEqual(new Date(2026, 10, 30, 9, 15))
    expect(date).toEqual(new Date(2026, 11, 30, 9, 15))
  })
})

describe('addMonths', () => {
  test('clamps the day to the end of a shorter month', () => {
    expect(addMonths(new Date(2026, 0, 31), 1)).toEqual(new Date(2026, 1, 28))
    expect(addMonths(new Date(2028, 0, 31), 1)).toEqual(new Date(2028, 1, 29))
    expect(addMonths(new Date(2026, 2, 31), -1)).toEqual(new Date(2026, 1, 28))
  })

  test('crosses years in both directions', () => {
    expect(addMonths(new Date(2026, 10, 20), 3)).toEqual(new Date(2027, 1, 20))
    expect(addMonths(new Date(2026, 1, 20), -3)).toEqual(new Date(2025, 10, 20))
  })
})

describe('addYears', () => {
  test('moves February 29 to February 28 in a common year', () => {
    expect(addYears(new Date(2028, 1, 29), 1)).toEqual(new Date(2029, 1, 28))
    expect(addYears(new Date(2026, 9, 20), -1)).toEqual(new Date(2025, 9, 20))
  })
})
