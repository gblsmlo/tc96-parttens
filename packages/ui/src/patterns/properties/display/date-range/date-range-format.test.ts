import { describe, expect, test } from 'bun:test'
import { formatDateRangeProperty } from './date-range-format'

const march = new Date(2026, 2, 2)
const april = new Date(2026, 3, 15)

describe('formatDateRangeProperty', () => {
  test('formats without rendering', () => {
    expect(
      formatDateRangeProperty({ from: march, to: april }, 'x', 'en-US'),
    ).toBe('Mar 2 – Apr 15')
    expect(formatDateRangeProperty(undefined, 'Sem período', 'en-US')).toBe(
      'Sem período',
    )
  })

  test('formats an open range with default and custom words', () => {
    expect(
      formatDateRangeProperty({ from: march, to: undefined }, 'x', 'en-US'),
    ).toBe('A partir de Mar 2')
    expect(
      formatDateRangeProperty({ from: undefined, to: april }, 'x', 'en-US'),
    ).toBe('Até Apr 15')
    expect(
      formatDateRangeProperty({ from: march, to: undefined }, 'x', 'en-US', {
        fromLabel: 'From',
      }),
    ).toBe('From Mar 2')
  })
})
