import { describe, expect, test } from 'bun:test'
import { slotFromOffset } from './slot'

describe('slotFromOffset', () => {
  test('floors the pointer to the snap increment and spans one increment', () => {
    expect(
      slotFromOffset({ height: 1440, offsetY: 607, snapMinutes: 15 }),
    ).toEqual({ endMinutes: 615, startMinutes: 600 })
    expect(
      slotFromOffset({ height: 1440, offsetY: 614, snapMinutes: 15 }),
    ).toEqual({ endMinutes: 615, startMinutes: 600 })
  })

  test('scales the offset by the column height', () => {
    expect(
      slotFromOffset({ height: 72, offsetY: 36, snapMinutes: 30 }),
    ).toEqual({ endMinutes: 750, startMinutes: 720 })
  })

  test('keeps the last slot inside the day', () => {
    expect(
      slotFromOffset({ height: 1440, offsetY: 1440, snapMinutes: 15 }),
    ).toEqual({ endMinutes: 1440, startMinutes: 1425 })
    expect(
      slotFromOffset({ height: 1440, offsetY: -20, snapMinutes: 60 }),
    ).toEqual({ endMinutes: 60, startMinutes: 0 })
  })

  test('falls back to the first slot for a zero-height column', () => {
    expect(slotFromOffset({ height: 0, offsetY: 10, snapMinutes: 15 })).toEqual(
      { endMinutes: 15, startMinutes: 0 },
    )
  })
})
