import { describe, expect, test } from 'bun:test'

import {
  fromZonedDateTime,
  getTimeZoneOffsetMs,
  toZonedDateTime,
} from './calendar-math'

const FORTALEZA = 'America/Fortaleza'
const NEW_YORK = 'America/New_York'
const TOKYO = 'Asia/Tokyo'

describe('toZonedDateTime', () => {
  test('projects an instant into the wall clock of the zone', () => {
    const instant = new Date('2026-08-29T02:00:00.000Z')

    expect(toZonedDateTime(instant, FORTALEZA)).toEqual({
      date: { day: 28, month: 8, year: 2026 },
      minutes: 23 * 60,
    })
    expect(toZonedDateTime(instant, 'UTC')).toEqual({
      date: { day: 29, month: 8, year: 2026 },
      minutes: 120,
    })
    expect(toZonedDateTime(instant, TOKYO)).toEqual({
      date: { day: 29, month: 8, year: 2026 },
      minutes: 11 * 60,
    })
  })
})

describe('getTimeZoneOffsetMs', () => {
  test('reports fixed and dst-dependent offsets', () => {
    const august = new Date('2026-08-12T12:00:00.000Z')
    const january = new Date('2026-01-12T12:00:00.000Z')

    expect(getTimeZoneOffsetMs(august, FORTALEZA)).toBe(-3 * 3_600_000)
    expect(getTimeZoneOffsetMs(august, NEW_YORK)).toBe(-4 * 3_600_000)
    expect(getTimeZoneOffsetMs(january, NEW_YORK)).toBe(-5 * 3_600_000)
    expect(getTimeZoneOffsetMs(august, 'UTC')).toBe(0)
  })
})

describe('fromZonedDateTime', () => {
  test('round-trips wall times in zones with and without dst', () => {
    for (const timeZone of [FORTALEZA, 'UTC', TOKYO, NEW_YORK]) {
      const zoned = {
        date: { day: 12, month: 8, year: 2026 },
        minutes: 14 * 60 + 30,
      }
      const instant = fromZonedDateTime(zoned, timeZone)

      expect(toZonedDateTime(instant, timeZone)).toEqual(zoned)
    }
  })

  test('converts fortaleza wall time to the exact utc instant', () => {
    const instant = fromZonedDateTime(
      { date: { day: 12, month: 8, year: 2026 }, minutes: 14 * 60 + 30 },
      FORTALEZA,
    )

    expect(instant.toISOString()).toBe('2026-08-12T17:30:00.000Z')
  })

  test('a nonexistent spring-forward hour resolves past the transition', () => {
    // Em 2026-03-08 o relógio de Nova York salta de 02:00 para 03:00.
    const instant = fromZonedDateTime(
      { date: { day: 8, month: 3, year: 2026 }, minutes: 2 * 60 + 30 },
      NEW_YORK,
    )

    expect(instant.toISOString()).toBe('2026-03-08T07:30:00.000Z')
    expect(toZonedDateTime(instant, NEW_YORK).minutes).toBe(3 * 60 + 30)
  })

  test('an ambiguous fall-back hour resolves to the first offset deterministically', () => {
    // Em 2026-11-01 01:30 acontece duas vezes em Nova York; fica a de EDT.
    const instant = fromZonedDateTime(
      { date: { day: 1, month: 11, year: 2026 }, minutes: 60 + 30 },
      NEW_YORK,
    )

    expect(instant.toISOString()).toBe('2026-11-01T05:30:00.000Z')
  })

  test('midnight maps to the start of the local day', () => {
    const instant = fromZonedDateTime(
      { date: { day: 12, month: 8, year: 2026 }, minutes: 0 },
      FORTALEZA,
    )

    expect(instant.toISOString()).toBe('2026-08-12T03:00:00.000Z')
  })
})
