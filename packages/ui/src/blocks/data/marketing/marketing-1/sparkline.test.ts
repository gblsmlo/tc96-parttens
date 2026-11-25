import { describe, expect, test } from 'bun:test'
import { buildSparklinePath } from './sparkline'

const box = { height: 20, padding: 2, width: 52 }

describe('buildSparklinePath', () => {
  test('returns an empty path without points', () => {
    expect(buildSparklinePath([], box)).toBe('')
  })

  test('maps the minimum to the bottom and the maximum to the top', () => {
    expect(buildSparklinePath([1, 3], box)).toBe('M2.0 18.0 L50.0 2.0')
  })

  test('centers a flat series', () => {
    expect(buildSparklinePath([4, 4, 4], box)).toBe(
      'M2.0 10.0 L26.0 10.0 L50.0 10.0',
    )
  })

  test('keeps a single point at the start', () => {
    expect(buildSparklinePath([7], box)).toBe('M2.0 10.0')
  })
})
