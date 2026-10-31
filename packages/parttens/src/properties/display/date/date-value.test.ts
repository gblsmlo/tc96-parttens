import { describe, expect, test } from 'bun:test'
import { formatDateProperty, serializeDatePropertyValue } from './date-value'

describe('date-value', () => {
  test('formats invalid or empty values with the fallback', () => {
    expect(formatDateProperty(null, 'No date', 'en-US', 'UTC')).toBe('No date')
    expect(formatDateProperty('not-a-date', 'No date', 'en-US', 'UTC')).toBe(
      'No date',
    )
  })

  test('serializes picked dates as date-only noon UTC values', () => {
    expect(serializeDatePropertyValue(new Date(2026, 5, 19))).toBe(
      '2026-06-19T12:00:00.000Z',
    )
  })
})
