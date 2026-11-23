import { describe, expect, test } from 'bun:test'
import { formatCountdown } from './format-countdown'

describe('formatCountdown', () => {
  test('formats seconds as m:ss', () => {
    expect(formatCountdown(581)).toBe('9:41')
    expect(formatCountdown(600)).toBe('10:00')
    expect(formatCountdown(65)).toBe('1:05')
  })

  test('pads the seconds to two digits', () => {
    expect(formatCountdown(9)).toBe('0:09')
    expect(formatCountdown(60)).toBe('1:00')
  })

  test('formats zero', () => {
    expect(formatCountdown(0)).toBe('0:00')
  })

  test('drops the fraction of a second', () => {
    expect(formatCountdown(59.9)).toBe('0:59')
  })

  test('does not wrap minutes into hours', () => {
    expect(formatCountdown(3600)).toBe('60:00')
  })

  test('clamps negative and non-finite values to zero', () => {
    expect(formatCountdown(-5)).toBe('0:00')
    expect(formatCountdown(Number.NaN)).toBe('0:00')
    expect(formatCountdown(Number.POSITIVE_INFINITY)).toBe('0:00')
  })
})
