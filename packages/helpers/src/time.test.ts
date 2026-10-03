import { describe, expect, test } from 'bun:test'
import { formatTimeOfDay, splitTimeOfDay } from './time'

const instant = new Date('2026-10-02T21:11:20Z')

describe('formatTimeOfDay', () => {
  test('formats the hour in the requested zone and locale', () => {
    expect(formatTimeOfDay(instant, { timeZone: 'UTC' })).toBe('9:11 PM')
    expect(
      formatTimeOfDay(instant, {
        locale: 'pt-BR',
        timeZone: 'America/Sao_Paulo',
      }),
    ).toBe('18:11')
    expect(
      formatTimeOfDay(instant, { hourCycle: 'h23', timeZone: 'Europe/London' }),
    ).toBe('22:11')
  })
})

describe('splitTimeOfDay', () => {
  test('separates hour and minute from seconds and day period', () => {
    expect(splitTimeOfDay(instant, { timeZone: 'UTC' })).toEqual({
      dayPeriod: ' PM',
      hourMinute: '9:11',
      second: ':20',
    })
  })

  test('leaves the day period empty for 24-hour locales', () => {
    expect(
      splitTimeOfDay(instant, {
        locale: 'pt-BR',
        timeZone: 'America/Sao_Paulo',
      }),
    ).toEqual({ dayPeriod: '', hourMinute: '18:11', second: ':20' })
  })

  test('reassembles into the full time', () => {
    const parts = splitTimeOfDay(instant, { timeZone: 'Asia/Tokyo' })
    expect(parts.hourMinute + parts.second + parts.dayPeriod).toBe('6:11:20 AM')
  })
})
