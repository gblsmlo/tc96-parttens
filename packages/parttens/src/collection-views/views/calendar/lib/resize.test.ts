import { describe, expect, test } from 'bun:test'

import { resizeCalendarSchedule, stepCalendarScheduleEdge } from './resize'

const grid = { snapMinutes: 15, timeZone: 'America/Sao_Paulo' }
const KATHMANDU = { snapMinutes: 15, timeZone: 'Asia/Kathmandu' }

const schedule = {
  end: new Date('2026-10-14T19:00:00.000Z'),
  isAllDay: false,
  start: new Date('2026-10-14T18:00:00.000Z'),
}

const offGrid = {
  ...schedule,
  start: new Date('2026-10-14T12:07:00.000Z'),
}

describe('resizeCalendarSchedule', () => {
  test('moves only the start edge', () => {
    expect(resizeCalendarSchedule(schedule, 'start', -30, grid)).toEqual({
      ...schedule,
      start: new Date('2026-10-14T17:30:00.000Z'),
    })
  })

  test('moves only the end edge', () => {
    expect(resizeCalendarSchedule(schedule, 'end', 45, grid)).toEqual({
      ...schedule,
      end: new Date('2026-10-14T19:45:00.000Z'),
    })
  })

  test('lands the moved edge on the wall-clock slot, not on the raw offset', () => {
    expect(resizeCalendarSchedule(offGrid, 'start', 10, grid)?.start).toEqual(
      new Date('2026-10-14T12:15:00.000Z'),
    )
  })

  test('aligns slots to the wall clock of a zone with a 45-minute offset', () => {
    const nepal = {
      ...schedule,
      start: new Date('2026-10-14T04:15:00.000Z'),
    }

    expect(resizeCalendarSchedule(nepal, 'start', 5, KATHMANDU)?.start).toEqual(
      new Date('2026-10-14T04:15:00.000Z'),
    )
  })

  test('keeps the minimum duration when an edge crosses the other', () => {
    expect(resizeCalendarSchedule(schedule, 'start', 120, grid)?.start).toEqual(
      new Date('2026-10-14T18:45:00.000Z'),
    )
    expect(resizeCalendarSchedule(schedule, 'end', -120, grid)?.end).toEqual(
      new Date('2026-10-14T18:15:00.000Z'),
    )
  })

  test('rejects an item without an end or an all-day item', () => {
    expect(
      resizeCalendarSchedule({ ...schedule, end: null }, 'end', 15, grid),
    ).toBeNull()
    expect(
      resizeCalendarSchedule({ ...schedule, isAllDay: true }, 'end', 15, grid),
    ).toBeNull()
  })
})

describe('stepCalendarScheduleEdge', () => {
  test('steps an edge already on the grid by one slot', () => {
    expect(
      stepCalendarScheduleEdge(schedule, 'end', 'later', grid)?.end,
    ).toEqual(new Date('2026-10-14T19:15:00.000Z'))
    expect(
      stepCalendarScheduleEdge(schedule, 'start', 'earlier', grid)?.start,
    ).toEqual(new Date('2026-10-14T17:45:00.000Z'))
  })

  test('steps an off-grid edge to the nearest line in the direction', () => {
    expect(
      stepCalendarScheduleEdge(offGrid, 'start', 'later', grid)?.start,
    ).toEqual(new Date('2026-10-14T12:15:00.000Z'))
    expect(
      stepCalendarScheduleEdge(offGrid, 'start', 'earlier', grid)?.start,
    ).toEqual(new Date('2026-10-14T12:00:00.000Z'))
  })
})
