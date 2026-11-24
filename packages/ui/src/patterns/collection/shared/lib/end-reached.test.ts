import { describe, expect, test } from 'bun:test'
import { isNearEnd, shouldFireEndReached } from './end-reached'

const viewport = {
  bottomInset: 0,
  clientHeight: 400,
  rowHeight: 36,
  scrollHeight: 2000,
  threshold: 5,
}

describe('isNearEnd', () => {
  test('is false while more than the threshold of rows remains below', () => {
    expect(isNearEnd({ ...viewport, scrollTop: 0 })).toBe(false)
    expect(isNearEnd({ ...viewport, scrollTop: 1400 })).toBe(false)
  })

  test('is true once the remaining distance is within threshold rows', () => {
    expect(isNearEnd({ ...viewport, scrollTop: 1420 })).toBe(true)
    expect(isNearEnd({ ...viewport, scrollTop: 1600 })).toBe(true)
  })

  test('counts the sticky bottom bar as part of the end', () => {
    expect(isNearEnd({ ...viewport, bottomInset: 36, scrollTop: 1383 })).toBe(
      false,
    )
    expect(isNearEnd({ ...viewport, bottomInset: 36, scrollTop: 1456 })).toBe(
      true,
    )
  })

  test('is true when the content is shorter than the viewport', () => {
    expect(isNearEnd({ ...viewport, scrollHeight: 300, scrollTop: 0 })).toBe(
      true,
    )
  })

  test('is false for an unmeasured viewport and treats a negative threshold as zero', () => {
    expect(isNearEnd({ ...viewport, clientHeight: 0, scrollTop: 1600 })).toBe(
      false,
    )
    expect(isNearEnd({ ...viewport, scrollTop: 1599, threshold: -3 })).toBe(
      false,
    )
    expect(isNearEnd({ ...viewport, scrollTop: 1600, threshold: -3 })).toBe(
      true,
    )
  })
})

describe('shouldFireEndReached', () => {
  const ready = {
    firedForCount: undefined,
    loading: false,
    nearEnd: true,
    rowCount: 25,
  }

  test('fires once for each row count', () => {
    expect(shouldFireEndReached(ready)).toBe(true)
    expect(shouldFireEndReached({ ...ready, firedForCount: 25 })).toBe(false)
    expect(
      shouldFireEndReached({ ...ready, firedForCount: 25, rowCount: 50 }),
    ).toBe(true)
  })

  test('stays quiet while loading, away from the end or without rows', () => {
    expect(shouldFireEndReached({ ...ready, loading: true })).toBe(false)
    expect(shouldFireEndReached({ ...ready, nearEnd: false })).toBe(false)
    expect(shouldFireEndReached({ ...ready, rowCount: 0 })).toBe(false)
  })
})
