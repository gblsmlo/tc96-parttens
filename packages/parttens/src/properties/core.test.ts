import { describe, expect, test } from 'bun:test'
import {
  formatDateProperty,
  formatDateRangeProperty,
  parseDatePropertyValue,
  propertyToneClassName,
  serializeDatePropertyValue,
} from './core'

describe('properties core', () => {
  test('formats, parses and serializes a date without rendering', () => {
    const serialized = serializeDatePropertyValue(new Date(2026, 5, 19))

    expect(serialized).toBe('2026-06-19T12:00:00.000Z')
    expect(parseDatePropertyValue(serialized)?.toISOString()).toBe(serialized)
    expect(parseDatePropertyValue(null)).toBeNull()
    expect(formatDateProperty(serialized, 'Sem data', 'en-US', 'UTC')).toBe(
      'Jun 19',
    )
    expect(formatDateProperty(null, 'Sem data', 'en-US', 'UTC')).toBe(
      'Sem data',
    )
  })

  test('formats a date range without rendering', () => {
    expect(
      formatDateRangeProperty(
        { from: new Date(2026, 2, 2), to: new Date(2026, 3, 15) },
        'Sem período',
        'en-US',
      ),
    ).toBe('Mar 2 – Apr 15')
    expect(formatDateRangeProperty(undefined, 'Sem período', 'en-US')).toBe(
      'Sem período',
    )
  })

  test('exposes the tone class map', () => {
    expect(propertyToneClassName.danger).toBe('text-destructive-foreground')
  })

  test('keeps the formatters out of the client modules', async () => {
    for (const file of [
      './display/date/date-value.ts',
      './display/date-range/date-range-format.ts',
    ]) {
      const source = await Bun.file(new URL(file, import.meta.url)).text()

      expect(source).not.toContain('use client')
      expect(source).not.toContain("from 'react'")
    }
  })
})
