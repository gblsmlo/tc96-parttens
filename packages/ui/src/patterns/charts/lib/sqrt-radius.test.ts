import { describe, expect, test } from 'bun:test'
import { sqrtRadiusScale } from './sqrt-radius'

describe('sqrtRadiusScale', () => {
  test('maps the extent to the radius range', () => {
    const radius = sqrtRadiusScale([4, 100], [2, 10])
    expect(radius(4)).toBe(2)
    expect(radius(100)).toBe(10)
  })

  test('grows area, not radius, linearly with the value', () => {
    const radius = sqrtRadiusScale([0, 100], [0, 10])
    expect(radius(25)).toBe(5)
  })

  test('returns the middle radius when every value is equal', () => {
    expect(sqrtRadiusScale([7, 7], [4, 8])(7)).toBe(6)
  })

  test('returns the minimum radius without values', () => {
    expect(sqrtRadiusScale([], [3, 9])(50)).toBe(3)
  })
})
