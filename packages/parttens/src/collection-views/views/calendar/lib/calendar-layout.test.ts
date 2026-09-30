import { describe, expect, test } from 'bun:test'

import type { CalendarItemSchedule } from '../types'
import { calendarRange } from './calendar-date'
import {
  assignTimeGridLanes,
  segmentItems,
  timeGridPosition,
} from './calendar-layout'

const FORTALEZA = 'America/Fortaleza'

interface FixtureItem {
  id: string
  schedule: CalendarItemSchedule | null
}

const item = (
  id: string,
  schedule: CalendarItemSchedule | null,
): FixtureItem => ({ id, schedule })

const segment = (
  items: FixtureItem[],
  range = calendarRange({ day: 12, month: 8, year: 2026 }, 'week', 0),
) =>
  segmentItems({
    getItemSchedule: (fixture: FixtureItem) => fixture.schedule,
    getKey: (fixture: FixtureItem) => fixture.id,
    items,
    range,
    timeZone: FORTALEZA,
  })

describe('segmentItems', () => {
  test('places an item by its wall-clock day in the view time zone', () => {
    // 02:00 UTC do dia 13 ainda é 23:00 do dia 12 em Fortaleza.
    const buckets = segment([
      item('late', {
        end: null,
        isAllDay: false,
        start: new Date('2026-08-13T02:00:00.000Z'),
      }),
    ])

    expect(buckets.get('2026-08-12')).toHaveLength(1)
    expect(buckets.get('2026-08-13')).toHaveLength(0)
  })

  test('slices a midnight-crossing window into one segment per day', () => {
    const buckets = segment([
      item('overnight', {
        end: new Date('2026-08-13T05:00:00.000Z'),
        isAllDay: false,
        start: new Date('2026-08-13T01:00:00.000Z'),
      }),
    ])
    const first = buckets.get('2026-08-12')?.[0]
    const second = buckets.get('2026-08-13')?.[0]

    expect(first).toMatchObject({
      endMinutes: 1440,
      isEnd: false,
      isStart: true,
      startMinutes: 22 * 60,
    })
    expect(second).toMatchObject({
      endMinutes: 2 * 60,
      isEnd: true,
      isStart: false,
      startMinutes: 0,
    })
  })

  test('an all-day window ending at midnight stays on its single day', () => {
    const buckets = segment([
      item('allday', {
        end: new Date('2026-08-13T03:00:00.000Z'),
        isAllDay: true,
        start: new Date('2026-08-12T03:00:00.000Z'),
      }),
    ])

    expect(buckets.get('2026-08-12')?.[0]).toMatchObject({
      endMinutes: 1440,
      isAllDay: true,
      isEnd: true,
      isStart: true,
      startMinutes: 0,
    })
    expect(buckets.get('2026-08-13')).toHaveLength(0)
  })

  test('drops items outside the range and items without schedule', () => {
    const buckets = segment([
      item('outside', {
        end: null,
        isAllDay: false,
        start: new Date('2026-09-20T12:00:00.000Z'),
      }),
      item('unscheduled', null),
    ])

    for (const bucket of buckets.values()) expect(bucket).toHaveLength(0)
  })

  test('a span starting before the range enters clamped without isStart', () => {
    const buckets = segment([
      item('spill', {
        end: new Date('2026-08-11T15:00:00.000Z'),
        isAllDay: false,
        start: new Date('2026-08-08T15:00:00.000Z'),
      }),
    ])
    const first = buckets.get('2026-08-09')?.[0]

    expect(first).toMatchObject({ isStart: false, startMinutes: 0 })
    expect(buckets.get('2026-08-11')?.[0]).toMatchObject({
      endMinutes: 12 * 60,
      isEnd: true,
    })
  })

  test('buckets come sorted by start then key', () => {
    const buckets = segment([
      item('b', {
        end: null,
        isAllDay: false,
        start: new Date('2026-08-12T13:00:00.000Z'),
      }),
      item('a', {
        end: null,
        isAllDay: false,
        start: new Date('2026-08-12T13:00:00.000Z'),
      }),
      item('early', {
        end: null,
        isAllDay: false,
        start: new Date('2026-08-12T11:00:00.000Z'),
      }),
    ])

    expect(buckets.get('2026-08-12')?.map((entry) => entry.itemKey)).toEqual([
      'early',
      'a',
      'b',
    ])
  })
})

describe('timeGridPosition', () => {
  test('maps minutes to percentages of the day', () => {
    expect(
      timeGridPosition({ endMinutes: 12 * 60, startMinutes: 10 * 60 + 30 }),
    ).toEqual({
      heightPct: 6.25,
      topPct: 43.75,
    })
  })

  test('a single instant keeps a minimum clickable height', () => {
    const position = timeGridPosition({ endMinutes: 600, startMinutes: 600 })

    expect(position.heightPct).toBe(2)
  })

  test('height never overflows the end of the day', () => {
    const position = timeGridPosition({ endMinutes: 1440, startMinutes: 1439 })

    expect(position.topPct + position.heightPct).toBeLessThanOrEqual(100)
  })
})

describe('assignTimeGridLanes', () => {
  test('overlapping segments split into side-by-side lanes', () => {
    const lanes = assignTimeGridLanes([
      { endMinutes: 720, itemKey: 'a', startMinutes: 600 },
      { endMinutes: 750, itemKey: 'b', startMinutes: 660 },
    ])

    expect(lanes.get('a')).toEqual({ laneCount: 2, laneIndex: 0 })
    expect(lanes.get('b')).toEqual({ laneCount: 2, laneIndex: 1 })
  })

  test('a chain of pairwise overlaps forms one cluster with two lanes', () => {
    // A cruza B, B cruza C, mas A não cruza C: C reusa a lane de A.
    const lanes = assignTimeGridLanes([
      { endMinutes: 660, itemKey: 'a', startMinutes: 600 },
      { endMinutes: 720, itemKey: 'b', startMinutes: 630 },
      { endMinutes: 750, itemKey: 'c', startMinutes: 690 },
    ])

    expect(lanes.get('a')).toEqual({ laneCount: 2, laneIndex: 0 })
    expect(lanes.get('b')).toEqual({ laneCount: 2, laneIndex: 1 })
    expect(lanes.get('c')).toEqual({ laneCount: 2, laneIndex: 0 })
  })

  test('disjoint segments keep the full column width', () => {
    const lanes = assignTimeGridLanes([
      { endMinutes: 540, itemKey: 'morning', startMinutes: 480 },
      { endMinutes: 900, itemKey: 'afternoon', startMinutes: 840 },
    ])

    expect(lanes.get('morning')).toEqual({ laneCount: 1, laneIndex: 0 })
    expect(lanes.get('afternoon')).toEqual({ laneCount: 1, laneIndex: 0 })
  })
})
